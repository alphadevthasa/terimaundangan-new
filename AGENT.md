# Hard Rules — Proyek Terima Undangan

## Ikon

- **DILARANG** menggunakan emoji sebagai ikon UI (`💒`, `🎂`, `⭐`, `✨`, `📋`, dll).
- **DILARANG** membuat ikon sendiri pakai CSS/SVG inline (kecuali logo atau elemen dekoratif).
- Semua ikon UI wajib menggunakan **Font Awesome 6** via CDN (`<i className="fas fa-xxx">`).
- Font Awesome sudah di-load di `app/layout.tsx`.

## Mapping ikon umum

| Kebutuhan | Class FA |
|-----------|----------|
| Wedding template | `fas fa-heart` |
| Birthday template | `fas fa-cake-candles` |
| Corporate template | `fas fa-building` |
| Default template | `fas fa-file` |
| Popular badge | `fas fa-star` |
| View/lihat | `fas fa-eye` |
| Edit | `fas fa-pencil` |
| Hapus/delete | `fas fa-trash-can` |
| Checkout/beli | `fas fa-credit-card` |
| Cart | `fas fa-cart-shopping` |
| Share/link | `fas fa-link` |
| Copy | `fas fa-copy` |
| Success | `fas fa-check-circle` |
| Error/warning | `fas fa-circle-exclamation` |
| Settings | `fas fa-gear` |
| Dashboard | `fas fa-gauge-high` |
| Template list | `fas fa-list` |
| Inbox/empty state | `fas fa-inbox` |
| Crown/premium | `fas fa-crown` |
| User/profile | `fas fa-user` |
| Envelope/message | `fas fa-envelope` |
| Music/audio | `fas fa-music` |
| Pause | `fas fa-pause` |
| Play | `fas fa-play` |
| Clock/time | `fas fa-clock` |
| Calendar | `fas fa-calendar-check` |
| Book/verse | `fas fa-book` |
| Scroll/story | `fas fa-scroll` |
| Gift | `fas fa-gift` |
| Mobile | `fas fa-mobile-screen-button` |
| Desktop | `fas fa-desktop` |
| Loading/spinner | `fas fa-spinner fa-pulse` |

## Branding

- Nama brand: **Terima Undangan** (bukan Enginetemplate).
- Copyright footer: `© 2026 terimaundangan.com`.
- Judul halaman (title): `Terima Undangan - Undangan Digital Premium`.

## Template HTML

- Setiap template HTML baru harus punya `window.updateInvitation` dan `postMessage` listener.
- Elemen yang bisa diedit harus pakai prefix `e-` pada id.
- Tidak perlu modal saat preview — postMessage cukup untuk update live preview.

## File Uploads

- Semua upload **gambar dan video** WAJIB via R2 Cloudflare — **dilarang** menyimpan file di server lokal.
- Upload menggunakan `handleImageUpload()` yang memanggil `/api/upload` → `uploadToR2()`.
- File lama WAJIB dihapus dari R2 saat diganti (`deleteFromR2()` via `oldUrl` field).
- Gunakan `@aws-sdk/client-s3` untuk operasi R2 (S3-compatible API).

## Code style

- Gunakan inline styles (`style={{ }}`), jangan CSS modules atau Tailwind.
- Font utama: `'Jost', sans-serif` untuk body, `'Cormorant Garamond', serif` untuk judul, `'Italiana', serif` untuk brand.
- Warna yang ada selalu konsisten: gold (#c9a961), dark (#0a0807), cream (#f5ecd9).
