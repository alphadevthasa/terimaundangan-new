# Panduan Integrasi Template Baru

Dokumen ini menjelaskan langkah-langkah yang harus diikuti untuk menambahkan template undangan digital baru ke dalam sistem Enginetemplate. Ikuti urutan di bawah ini dengan seksama.

---

## 📋 Daftar Isi

1. [Persiapan File HTML Template](#1-persiapan-file-html-template)
2. [Menambahkan ke Seed Data](#2-menambahkan-ke-seed-data)
3. [Menambahkan ke Shared Config](#3-menambahkan-ke-shared-config)
4. [Menambahkan Demo Data](#4-menambahkan-demo-data)
5. [Menambahkan Key Map (PENTING)](#5-menambahkan-key-map-penting)
6. [Menambahkan ke Template Configs Map](#6-menambahkan-ke-template-configs-map)
7. [Database Schema & Field Limitations](#7-database-schema--field-limitations)
8. [Menjalankan Seed & Verifikasi](#8-menjalankan-seed--verifikasi)

---

## 1. Persiapan File HTML Template

Buat file HTML template baru di **root project**, misalnya `nama_template.html` (sama seperti `honey_wdd_template.html`). Template HTML ini bisa berupa:

- **File lengkap** dengan editor wrapper (seperti `honey_wdd_template.html`) — punya form panel kiri & preview panel kanan
- **HTML murni** hanya undangan saja — tanpa editor wrapper

> Script escaping akan otomatis mengekstrak bagian invitation dari `<template id="invitation-template">` jika ada, atau menggunakan seluruh file jika tidak.

### Struktur yang Diperlukan

Template HTML harus memiliki:

#### a. Elemen dengan ID yang bisa di-update

Setiap elemen yang bisa diedit harus memiliki `id` dengan prefix `e-`:

```html
<!-- Contoh: teks -->
<span id="e-bride-name">Default Name</span>

<!-- Contoh: gambar -->
<img id="e-bride-photo" src="default.jpg" alt="Bride">

<!-- Contoh: innerHTML (untuk teks dengan <br>) -->
<span id="e-bride-parents">Default Parents</span>
```

#### b. Fungsi `updateInvitation` (WAJIB)

Template harus memiliki fungsi `window.updateInvitation` yang menerima object data. Fungsi ini akan dipanggil oleh editor untuk update live preview.

```html
<script>
window.updateInvitation = function(data) {
  // Teks biasa
  if (data.brideName) {
    document.getElementById('e-bride-name').textContent = data.brideName;
  }
  
  // Gambar
  if (data.bridePhoto) {
    document.getElementById('e-bride-photo').src = data.bridePhoto;
  }
  
  // innerHTML (jika ada tag HTML seperti <br>)
  if (data.brideParents) {
    document.getElementById('e-bride-parents').innerHTML = data.brideParents;
  }
  
  // Link href
  if (data.akadMaps) {
    document.getElementById('e-akad-maps').href = 
      'https://www.google.com/maps/search/?api=1&query=' + 
      encodeURIComponent(data.akadMaps);
  }
  
  // Countdown
  if (data.countdownDate) {
    weddingDate = new Date(data.countdownDate).getTime();
    updateCountdown();
  }
  
  // Dan seterusnya untuk semua field yang bisa diedit...
};
</script>
```

> **⚠️ PENTING:** Gunakan `data.brideName` (camelCase) di JavaScript, dan `id="e-bride-name"` (kebab-case) di HTML. Key di data object TIDAK harus sama dengan ID elemen.

#### c. PostMessage Listener (WAJIB)

Template harus mendengarkan `postMessage` dari parent window (editor):

```html
<script>
// Listen for postMessage from parent (for detail page preview and editor)
window.addEventListener('message', function(e) {
  if (e.data.type === 'UPDATE') {
    if (window.updateInvitation) {
      window.updateInvitation(e.data.payload);
    }
  }
});
</script>
```

#### d. Countdown Support (jika ada)

```html
<script>
let weddingDate;

function updateCountdown() {
  const distance = weddingDate - new Date().getTime();
  if (distance < 0) return;
  
  document.getElementById('cd-days').textContent = 
    String(Math.floor(distance / 86400000)).padStart(2, '0');
  document.getElementById('cd-hours').textContent = 
    String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('cd-mins').textContent = 
    String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('cd-secs').textContent = 
    String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
}

// Panggil setiap detik
setInterval(updateCountdown, 1000);
</script>
```

---

## 2. Menambahkan ke Seed Data

Edit `prisma/seed.ts`. Tambahkan object baru ke array `data`:

```typescript
{
  name: 'Nama Template',       // Harus UNIK — digunakan sebagai key di config
  description: 'Deskripsi template...',
  type: 'wedding',
  thumbnail: '',
  price: 'Free',               // 'Free' atau 'Premium'
  isPopular: false,
},
```

**Catatan:** Nama template (`name`) akan digunakan sebagai key di `TEMPLATE_CONFIGS`, jadi pastikan konsisten.

---

## 3. Menambahkan ke Shared Config

Edit `app/lib/templates-config.ts`. Ada 3 langkah:

### a. Buat konstanta template HTML

```typescript
export const NAMA_TEMPLATE = `<!DOCTYPE html>
<html lang="id">
... (seluruh HTML template, sudah diproses escaping)
</html>`;
```

### b. Proses Escaping

Karena HTML akan ditempatkan di dalam **template literal** (backtick) TypeScript, semua backtick `` ` `` dan `${` di dalam HTML harus di-escape:

- Setiap `` ` `` → `\``
- Setiap `${` → `\${`

Gunakan script Node.js berikut untuk memproses:

```javascript
// build_template.js
const fs = require('fs');

// Baca file HTML
let html = fs.readFileSync('nama_template.html', 'utf8');

// Ambil hanya bagian invitation (dari <template id="invitation-template">)
// Jika file tidak punya template tag, seluruh HTML akan digunakan
const match = html.match(/<template id="invitation-template">([\s\S]*?)<\/template>/);
const invitationHtml = match ? match[1].trim() : html;

// Escape backticks dan ${} untuk template literal TypeScript
// CATATAN: inline CSS double-quote escaping (\\\") TIDAK perlu diubah
let escaped = invitationHtml
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

// Generate output
const output = `export const NAMA_TEMPLATE = \`${escaped}\`;`;

fs.writeFileSync('/tmp/escaped_template.txt', output);
console.log('Done! Check /tmp/escaped_template.txt');
```

Jalankan:
```bash
node build_template.js
```

Kemudian copy output dari `/tmp/escaped_template.txt` ke `app/lib/templates-config.ts`.

> **⚠️ Bersihkan file temporary** setelah selesai:
> ```bash
> rm build_template.js
> ```

### c. Tambahkan postMessage listener

Pastikan di bagian `<script>` HTML sudah ada:

```javascript
window.addEventListener('message', function(e) {
  if (e.data.type === 'UPDATE') {
    if (window.updateInvitation) window.updateInvitation(e.data.payload);
  }
});
```

---

## 4. Menambahkan Demo Data

Buat object `DEMO_DATA_NAMA` dengan data default untuk preview. Key harus **sama persis** dengan yang diharapkan oleh fungsi `updateInvitation`.

```typescript
export const DEMO_DATA_NAMA: Record<string, string> = {
  brideName: 'Sienna',
  groomName: 'Arka',
  heroDate: '20 . 12 . 2025',
  brideFull: 'Sienna Pradipta Reswari',
  groomFull: 'Arka Mahesa Wijaya',
  brideParents: 'Bapak Surya Pratama, S.E.<br>& Ibu Lestari Wulandari, S.KM.',
  groomParents: 'Bapak Dr. Wijaya Kusuma, M.Sc.<br>& Ibu Maharani Anggraini, S.Pd.',
  bridePhoto: 'https://picsum.photos/seed/bride/600/800.jpg',
  groomPhoto: 'https://picsum.photos/seed/groom/600/800.jpg',
  akadDate: 'Sabtu, 20 Desember 2025',
  akadTime: '08.00 — 10.00 WIB',
  akadPlace: 'Masjid Agung Al-Azhar<br>Jakarta Selatan',
  akadMaps: 'Masjid Agung Al-Azhar Jakarta',
  resepsiDate: 'Sabtu, 20 Desember 2025',
  resepsiTime: '11.00 — 14.00 WIB',
  resepsiPlace: 'The Ritz-Carlton Ballroom<br>Jakarta Selatan',
  resepsiMaps: 'The Ritz-Carlton Jakarta',
  countdownDate: '2025-12-20T08:00:00+07:00',
  gallery1: 'https://picsum.photos/seed/gallery-1/600/800.jpg',
  gallery2: 'https://picsum.photos/seed/gallery-2/600/800.jpg',
  gallery3: 'https://picsum.photos/seed/gallery-3/600/800.jpg',
  gallery4: 'https://picsum.photos/seed/gallery-4/600/800.jpg',
  gallery5: 'https://picsum.photos/seed/gallery-5/600/800.jpg',
  gallery6: 'https://picsum.photos/seed/gallery-6/600/800.jpg',
};
```

---

## 5. Menambahkan Key Map (PENTING)

Sistem editor menyimpan data dengan field ID **kebab-case** (contoh: `bride-nick`, `groom-nick`). Tapi fungsi `updateInvitation` di template HTML mungkin menggunakan key **camelCase** (contoh: `brideName`, `groomName`).

**Jika key di `updateInvitation` berbeda format** dengan field ID editor, kamu harus membuat `keyMap`.

### Cara menentukan keyMap

1. Lihat field ID di editor (`editorSections` di `kelola-template/page.tsx`)
2. Lihat parameter yang diterima `updateInvitation(data)` di HTML template
3. Buat mapping dari nomor 1 → nomor 2

Contoh mapping untuk template yang pakai camelCase:

```typescript
keyMap: {
  // Field ID editor (kebab-case) → Key untuk updateInvitation (camelCase)
  'bride-nick': 'brideName',
  'groom-nick': 'groomName',
  'date-text': 'heroDate',
  'countdown-master': 'countdownDate',
  'bride-full': 'brideFull',
  'groom-full': 'groomFull',
  'bride-photo': 'bridePhoto',
  'groom-photo': 'groomPhoto',
  'akad-date': 'akadDate',
  'akad-time': 'akadTime',
  'akad-place': 'akadPlace',
  'resepsi-date': 'resepsiDate',
  'resepsi-time': 'resepsiTime',
  'resepsi-place': 'resepsiPlace',
  'gal-1': 'gallery1',
  'gal-2': 'gallery2',
  'gal-3': 'gallery3',
  'gal-4': 'gallery4',
  'gal-5': 'gallery5',
  'gal-6': 'gallery6',
}
```

### Kapan keyMap TIDAK diperlukan?

Jika template menggunakan pola **Elite Wedding** (sederhana) — yaitu key yang dikirim sama dengan nama ID elemen di HTML:

- Editor kirim: `{ 'bride-nick': 'Sophia' }`
- Template cari: `document.getElementById('e-bride-nick')`
- ✅ **Tidak perlu keyMap**

### Kapan keyMap DIPERLUKAN?

Jika template menggunakan pola **Honey Wedding** (camelCase):

- Editor kirim: `{ 'bride-nick': 'Sienna' }`  
- Template butuh: `data.brideName`
- ❌ **Tidak cocok** → perlu keyMap

---

## 6. Menambahkan ke Template Configs Map

Edit `app/lib/templates-config.ts`, tambahkan entry baru ke `TEMPLATE_CONFIGS`:

### Tanpa keyMap (pola Elite Wedding):

```typescript
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  'Elite Wedding': { html: ELITE_WEDDING_TEMPLATE, demoData: DEMO_DATA_ELITE },
  'Honey Wedding': {
    html: HONEY_WEDDING_TEMPLATE,
    demoData: DEMO_DATA_HONEY,
    // keyMap tidak diperlukan jika key di demoData = key yang dicari template
  },
  'Nama Template Baru': {
    html: NAMA_TEMPLATE,
    demoData: DEMO_DATA_NAMA,
  },
};
```

### Dengan keyMap:

```typescript
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  // ... template lain ...
  'Nama Template Baru': {
    html: NAMA_TEMPLATE,
    demoData: DEMO_DATA_NAMA,
    keyMap: {
      'bride-nick': 'brideName',
      'groom-nick': 'groomName',
      // ... mapping lengkap ...
    },
  },
};
```

---

## 7. Database Schema & Field Limitations

### ⚠️ Batasan Penting

Model `Customer` di `prisma/schema.prisma` memiliki **field yang tetap (fixed)** — field ini sudah ditentukan dan hanya mencakup field yang digunakan oleh template Elite Wedding.

**Jika template baru membutuhkan field tambahan** yang tidak ada di schema (misalnya `brideParents`, `groomParents`, `akadMaps`), nilai-nilai tersebut:

1. ✅ Bisa ditampilkan di preview (via `updateInvitation`)
2. ✅ Bisa dikirim via `postMessage` untuk live preview
3. ❌ **TIDAK akan tersimpan** di database karena tidak ada kolom yang sesuai

### Solusi: Update Prisma Schema

Jika template baru punya field unik yang perlu disimpan:

1. Tambah kolom baru ke `prisma/schema.prisma`:
```prisma
model Customer {
  // ... field existing ...
  brideParents String @default("")
  groomParents String @default("")
  akadMaps     String @default("")
  resepsiMaps  String @default("")
}
```

2. Sync database:
```bash
npx prisma db push --accept-data-loss
```

3. (Opsional) Tambah field ke `editorSections` di `kelola-template/page.tsx` jika ingin muncul di form editor.

---

## 8. Menjalankan Seed & Verifikasi

### a. Hapus template lama & seed ulang

```bash
# Hapus SEMUA template (HATI-HATI: ini akan meng-orphan customer records!)
# Alternatif: hapus hanya 1 template tertentu
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.template.deleteMany({ where: { name: 'Nama Template Lama' } }).then((r) => { 
  console.log('Deleted:', r.count); 
  p.\$disconnect(); 
}).catch(e => console.error(e));
"

# Seed ulang
npx tsx prisma/seed.ts
```

> **⚠️ PERINGATAN:** `template.deleteMany()` tanpa `where` akan menghapus SEMUA template dan meng-orphan Customer records yang mereferensikannya. Gunakan dengan hati-hati!

### b. Sync schema jika ada perubahan

```bash
npx prisma db push
```

### c. Typecheck

```bash
npx tsc --noEmit
```

### d. Verifikasi di browser

1. Buka `/dashboard/list-template` — template baru harus muncul
2. Klik **Edit** — masuk ke `/dashboard/kelola-template?id=xxx`
3. Ubah field di form editor — preview harus terupdate
4. Buka `/dashboard/list-template/[id]` — preview harus tampil dengan HTML yang benar

---

## 📝 Checklist Verifikasi

Sebelum selesai, pastikan semua ini berfungsi:

- [ ] Template muncul di `/dashboard/list-template`
- [ ] Preview di list-template detail menampilkan HTML yang benar
- [ ] Klik "Edit" masuk ke `/dashboard/kelola-template`
- [ ] Form editor muncul dengan data default
- [ ] **Mengubah field editor → preview terupdate secara realtime**
- [ ] Tombol Save berfungsi (data tersimpan per templateId)
- [ ] TypeScript tidak ada error (`npx tsc --noEmit`)
- [ ] Data antar template tidak saling mempengaruhi
- [ ] File temporary (`build_template.js`) sudah dibersihkan

---

## 🔍 Troubleshooting

### Preview tidak update saat diedit

**Penyebab 1:** `keyMap` tidak sesuai.
Periksa: Apakah `updateInvitation(data)` menerima key yang sama dengan yang dikirim editor?

**Penyebab 2:** `postMessage` listener tidak terpasang.
Pastikan ada `window.addEventListener('message', ...)` yang memanggil `updateInvitation`.

### Preview menampilkan template yang salah

**Penyebab:** Konstanta HTML di `templates-config.ts` tidak sesuai dengan file HTML asli.

Solusi: Ulangi proses escaping dengan script Node.js.

### Data antar template tercampur

**Penyebab:** API tidak menerima `templateId`.
Periksa: `fetchTemplate` harus panggil `/api/customer?templateId=xxx`.
Periksa: `saveTemplate` harus kirim `templateId` di body.

### Field tertentu tidak tersimpan

**Penyebab:** Field tidak ada di Prisma schema `Customer` model.
Solusi: Tambah kolom ke `schema.prisma` dan jalankan `npx prisma db push --accept-data-loss`.
