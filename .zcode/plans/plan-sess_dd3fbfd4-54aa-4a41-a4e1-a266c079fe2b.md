# Security & Auth Harness — Implementation Plan

Mengganti cookie `session=true` yang bisa di-forge dengan **JWT (jose)**, memproteksi semua 9 admin routes + upload + profile, menambah rate limiting & failed-login lockout, memperbaiki Turnstile fail-open, membuat route logout, dan mengatasi bug integritas webhook pembayaran.

**Koreksi penting dari eksplorasi awal:** `lib/template-utils.ts` yang dilaporkan hilang **sudah tidak lagi direferensikan** (grep konfirmasi 0 hasil). Schema sudah di-refactor — `Customer` jadi auth-only, data undangan pindah ke `TemplateData`. Jadi itu bukan bug lagi dan **di luar scope ini**.

---

## Bagian A — Foundation: Session library (`lib/session.ts`) + env

**New file: `lib/session.ts`**
- `signSession(payload: { sub, email, isAdmin }): Promise<string>` — JWT ditandatangani dengan `jose.SignJWT`, klaim: `{ sub, email, isAdmin }`, `exp: 24h`, alg `HS256`, secret dari `process.env.SESSION_SECRET`.
- `verifySession(token: string | undefined): Promise<SessionPayload | null>` — memverifikasi & mendekode; mengembalikan `null` jika invalid/expired.
- `setSessionCookie(res, token)` — mengatur cookie `session` dengan `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'strict'`, `path: '/'`, `maxAge: 86400`.
- `getSessionFromRequest(req): Promise<SessionPayload | null>` — membaca cookie `session` lalu `verifySession`.
- `clearSessionCookie(res)` — menghapus cookie.
- Konstanta `SESSION_COOKIE = 'session'`.

**New file: `.env.example`** (reference; existing `.env.local` left untouched) — documentasi: `SESSION_SECRET` (min 32 bytes random), plus note untuk `TURNSTILE_SECRET_KEY` yang sudah ada.

**`package.json`** — add dep `jose` (Edge-compatible, native WebCrypto).

---

## Bagian B — Route helpers (`lib/auth.ts`)

New file berisi 3 helper yang dipakai semua protected route:

- `requireSession(req): Promise<{ session; response?: NextResponse }>` — memanggil `getSessionFromRequest`; jika tidak ada/invalid → return `{ response: 401 JSON { error: 'Unauthorized' } }`.
- `requireAdmin(req)` — memanggil `requireSession`, lalu cek `session.isAdmin === true`; jika bukan admin → return 403.
- `requireCustomer(req)` — `requireSession` (any logged-in customer; admin juga lolos kalau perlu).

Pattern pemakaian di tiap route handler:
```ts
const { session, response } = await requireAdmin(request);
if (response) return response;
// ...lanjut logic, bisa akses session.email / session.sub
```

---

## Bagian C — Perbaiki middleware (stop bypass semua `/api/*`)

Edit `middleware.ts`:
- **Verifikasi JWT di Edge** (jose Edge-compatible) — bukan cek literal `'true'` lagi.
- Tetap allow static files, dan **public API routes** yang di-whitelist: `/api/auth/login`, `/api/auth/signup`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/xendit/webhook` (token-based), `/api/create-invoice`, `/api/wishes` (guest-facing), `/api/cover/[id]` (public preview).
- **Gate `/api/admin/**`**: wajib valid JWT + `isAdmin`. Invalid → 401/403 JSON.
- **Gate `/api/upload`**: wajib valid JWT (any logged-in). Invalid → 401.
- **Gate `/api/customer/**`**: wajib valid JWT.
- Page routes `/dashboard` & `/admin`: cek JWT valid; admin pages butuh `isAdmin`.
- Helper internal `extractSession(request)` membaca cookie + `jose.jwtVerify` (async middleware didukung Next 14).

> Catatan: middleware jadi async. Matcher tetap sama. Page-level admin enforcement (`isAdmin`) dilakukan di middleware sekaligus di route helper (defense in depth).

---

## Bagian D — Auth routes (login, signup, logout, profile, reset)

1. **`app/api/auth/login/route.ts`** (edit):
   - Ganti `response.cookies.set('session', 'true', ...)` → `signSession({...})` lalu `setSessionCookie`.
   - Add **rate limit** `checkRateLimit('login:'+ip, { maxRequests: 10, windowSeconds: 600 })` di awal.
   - Add **failed-login tracking**: increment `checkRateLimit('login-fail:'+email)` per failed attempt; kalau exceeded → 429. On success → clear.
   - Unify error messages → generic `"Email atau password salah"` (fix user enumeration).

2. **`app/api/auth/signup/route.ts`** (edit):
   - Ganti cookie → JWT session.
   - Add rate limit `signup:+ip` `{ maxRequests: 5, windowSeconds: 3600 }`.

3. **NEW `app/api/auth/logout/route.ts`**:
   - POST → `clearSessionCookie` → 200 `{ success: true }`. (Tidak ada route logout sekarang — cookie "session" bertahan walau client-side logout.)

4. **`app/api/auth/profile/route.ts`** (edit — fix account takeover):
   - Mulai dengan `const { session, response } = await requireCustomer(request); if (response) return response;`.
   - Cari customer by **`session.sub`** (dari JWT), **bukan** by `email` dari body.
   - Buang `email` dari identifikasi; `newEmail` tetap boleh dari body (ganti email) tapi aksesnya scoped ke `session.sub`.
   - Email change & password change tetap via body, tapi hanya untuk akun yang sedang login.

5. **`app/api/auth/reset-password/route.ts`** (edit):
   - Add rate limit `reset:+ip` `{ maxRequests: 5, windowSeconds: 900 }`.
   - Add failed-token tracking; clear on success.

---

## Bagian E — 9 Admin API routes: add `requireAdmin`

Setiap file di bawah ini diawali dengan:
```ts
const { response } = await requireAdmin(request);
if (response) return response;
```
(di awal tiap handler `GET`/`POST`/`PUT`/`DELETE`).

Files:
- `app/api/admin/templates/route.ts` (GET, POST)
- `app/api/admin/templates/[id]/route.ts` (GET, PUT, DELETE)
- `app/api/admin/orders/route.ts` (GET)
- `app/api/admin/orders/[id]/route.ts` (GET/PUT)
- `app/api/admin/orders/mark-paid/route.ts` (POST)
- `app/api/admin/customers/route.ts` (GET)
- `app/api/admin/customers/[id]/route.ts`
- `app/api/admin/stats/route.ts`
- `app/api/admin/revenue/route.ts`

(Defense in depth: middleware sudah gate `/api/admin/**`, helper jaga kalau matcher bocor / route baru lupa pakai matcher.)

---

## Bagian F — Upload hardening (`app/api/upload/route.ts`)

Edit:
- Awali `requireCustomer` (logged-in only).
- **Extension allowlist** `['jpg','jpeg','png','webp','gif']` — derive ext from filename, validate against set, ignore client ext mismatch.
- **Magic-byte validation**: cek signature buffer (`0xFF D8 FF` JPEG, `0x89 50 4E 47` PNG, `RIFF....WEBP` WebP, `GIF8` GIF). Tolak kalau MIME header ≠ magic bytes. Lightweight, no extra dep.
- **Double-extension guard**: ambil hanya 1 ext, tolowercase, force-append ke generated name; never use user filename.
- **Rate limit** `upload:+ip` (atau `upload:+session.sub`) `{ maxRequests: 30, windowSeconds: 600 }`.
- Path traversal sudah aman (regenerated filename) — tetap dipertahankan.

---

## Bagian G — Turnstile fail-closed (`lib/turnstile.ts`)

Edit:
- Hapus `return true` saat secret kosong. Ganti: kalau `!secretKey` di **production** → `return false` (fail-closed) + `console.error`. Di non-production → `return true` (supaya dev tetap jalan, tapi log warn jelas).
- Tetap validasi response. Network/parse errors → `false` (sudah benar).

---

## Bagian H — Rate limiter robustness (`lib/rate-limiter.ts`)

Edit:
- **Stop trusting `x-forwarded-for` blindly**: baca multiple XFF chain, ambil **first non-private IP**. Filter loopback/private ranges (`10.x, 172.16-31.x, 192.168.x, 127.x`). Fallback `unknown` tetap.
- Add **Map cleanup**: periodically delete expired entries saat `checkRateLimit` dipanggil (lazy GC, every N calls).
- Add per-key TTL discipline. (Redis tetap noted di comment sebagai future; tidak ditambah dep sekarang.)

---

## Bagian I — Payment webhook integrity (`app/api/xendit/webhook/route.ts`)

Edit:
1. **Timing-safe token compare**: ganti `token !== env` → `crypto.timingSafeEqual` (dengan length check dulu).
2. **Hapus bom global** `updateMany({status:'active'})→draft` (line 48-51). Itu data-integrity disaster. Jika fungsionalitas "1 active per customer" masih diinginkan, scope ke `customer.id` spesifik saja (sebelum promote).
3. **Atomicity**: wrap `order.updateMany` + `customer.create/update` + `templateData.create` di dalam **`prisma.$transaction(async tx => {...})`**. Kalau salah satu gagal → rollback semua. Pakai `tx.` prefix.
4. **Order ops sebelum template lookup**: pindahkan validasi `templateId` lookup **lebih awal** (sebelum mark order paid), supaya 404 tidak tinggalkan orphan paid order.
5. **Idempotency key**: pakai `body.id` (Xendit invoice id) — cek tabel Order `where: { invoiceUrl: body.id }` atau add field? Minimum: skip processing jika order dengan external_id sudah `paid`.
6. **Audit log**: persist webhook event (`console.log` minimal, atau optional `WebhookEvent` model — tahan di comment, tidak add schema untuk avoid migration risk).
7. **try/catch** wrap whole handler → 500 structured, Xendit retry aman.

> Catatan scope: **tidak** add body signature verification Xendit (Xendit invoice webhook pakai callback-token, tidak ada raw-body signature universal; token compare timing-safe sudah best-practice untuk model ini). Tidak add `WebhookEvent` model (menghindari migration — di-comment sebagai future).

---

## Bagian J — Client logout wiring

Cari dimana client-side logout dilakukan (kemungkinan `components/Sidebar.tsx`, `app/dashboard/layout.tsx`, `app/admin/layout.tsx`) → tambahkan `fetch('/api/auth/logout', { method:'POST' })` sebelum `router.push('/login')` supaya cookie server benar-benar di-clear.

---

## Bagian K — Documentation

**New: `API_ROUTE_AGENT.md`** (sesuai plan kemarin Section 1.B) — panduan singkat hasil dari pekerjaan ini:
- Standar auth: public route vs customer route vs admin route; `requireSession/requireCustomer/requireAdmin` usage.
- Response format, error codes (400/401/403/429/500), rate-limit header convention.
- Cookie/session contract (JWT, cookie name, expiry, rotation via re-login).
- Upload safety checklist. Webhook integrity checklist.

---

## Tidak termasuk scope ini (eksplisit)
- Template Onboarding harness (Case 1), agents/skills docs lainnya, fix `lib/template-utils` (sudah resolved), schema drift `slug`/`published` (di `[slug]/page.tsx` — terpisah, perlu cek apakah `TemplateData` sudah punya field publish/slug), Redis rate-limiter (future). Itu iterasi berikutnya sesuai prioritas plan asli.

---

## Urutan eksekusi & testing
1. **A+B** (session lib + auth helper) — isolated, testable.
2. **D** (auth routes: login/signup/logout/profile/reset) — ganti ke JWT.
3. **C** (middleware) — baru verifikasi JWT.
4. **E** (admin routes) — add requireAdmin.
5. **F** (upload), **G** (turnstile), **H** (rate limiter).
6. **I** (webhook).
7. **J** (client logout wiring) + **K** (docs).

**Verifikasi tiap fase:** `npm run build` (typecheck) + manual smoke test login→dashboard→admin→logout. Webhook di-test via `curl` dengan token env. Tidak ada test framework yang ditambah; mengandalkan typecheck + smoke manual.

## Risk callouts
- **`jose` di middleware Edge**: perlu pastikan `jose` versi compatible dengan runtime Edge Next 14 — pakai latest stable `jose@5`.
- **Migration cookie**: user yang sedang login dengan cookie `session=true` lama akan langsung di-kick (JWT verify fail) → harus login ulang. Itu expected & aman; bukan production traffic blocker karena secret belum dipublikasi.
- **Public API whitelist middleware**: kalau ada API route public yang lupa di-whitelist → akan 401. Saya akan grep semua `/api/` route dulu sebelum finalize whitelist untuk pastikan tidak ada yang miss.
- **Webhook `$transaction`**: pastikan tidak ada side-effect non-DB di dalam transaction (email send, dll) — webhook saat ini tidak kirim email, aman.