# Panduan Seed Template Birthday

> **Dokumen khusus untuk menambahkan template undangan ulang tahun (Birthday) ke sistem Terima Undangan.**
>
> Template birthday memiliki struktur, editor sections, dan data default yang **berbeda** dari wedding. Ikuti panduan ini dengan seksama.

---

## 📋 Daftar Isi

1. [Persiapan File HTML Template](#1-persiapan-file-html-template)
2. [Menambahkan Editor Sections](#2-menambahkan-editor-sections)
3. [Menambahkan ke Seed Data](#3-menambahkan-ke-seed-data)
4. [Menambahkan Demo Data](#4-menambahkan-demo-data)
5. [Menambahkan Key Map (Jika Diperlukan)](#5-menambahkan-key-map-jika-diperlukan)
6. [Menambahkan ke Template Configs Map](#6-menambahkan-ke-template-configs-map)
7. [Menambahkan Template Section Filter](#7-menambahkan-template-section-filter)
8. [Menambahkan Background Defaults (Opsional)](#8-menambahkan-background-defaults-opsional)
9. [Database Schema & Field Mapping](#9-database-schema--field-mapping)
10. [Menjalankan Seed & Verifikasi](#10-menjalankan-seed--verifikasi)
11. [Side-by-Side: Birthday vs Wedding](#11-side-by-side-birthday-vs-wedding)

---

## 1. Persiapan File HTML Template

### 1.1 Buat File HTML

Letakkan file HTML template di folder `templates/birthday/`:

```
templates/birthday/
  └── kids_birthday_white_theme.html   ← template baru
  └── ... (template birthday lain nanti)
```

### 1.2 Struktur HTML yang Diperlukan

Template HTML harus memiliki:

#### a. Elemen dengan ID prefix `e-` (WAJIB)

```html
<!-- Cover -->
<span id="e-child-nick">Leo</span>
<span id="e-child-age">5</span>
<span id="e-invite-text">Kamu Diundang!</span>
<div class="cover-bg" id="e-hero-bg">...</div>

<!-- Profile -->
<img id="e-child-photo" src="default.jpg" alt="Child">
<h3 id="e-child-full">Leonard (Leo)</h3>
<h2 id="e-opening-title">Halo Teman-teman!</h2>
<p id="e-opening-message">Leo akan berulang tahun yang ke-5!...</p>

<!-- Countdown -->
<span id="e-cd-days">00</span>
<span id="e-cd-hours">00</span>
<span id="e-cd-mins">00</span>
<span id="e-cd-secs">00</span>

<!-- Event Details -->
<span id="e-event-date">Minggu, 15 Agustus 2026</span>
<span id="e-event-time">Pukul 15.00 WIB - Selesai</span>
<span id="e-event-place">Taman Bermain Ceria</span>
<p id="e-event-address">Jl. Pelangi Indah No. 12, Jakarta</p>
<a id="e-event-maps" href="...">Buka di Google Maps</a>

<!-- Gallery (4 foto) -->
<img id="e-gal-1" src="...">
<img id="e-gal-2" src="...">
<img id="e-gal-3" src="...">
<img id="e-gal-4" src="...">

<!-- Gifts -->
<span id="e-bank-name">BCA</span>
<span id="e-bank-acc">1234567890</span>
<span id="e-bank-holder">Orang Tua Leo</span>

<!-- Closing -->
<h2 id="e-closing-thanks">Terima Kasih!</h2>
<p id="e-closing-fam">Leo & Keluarga</p>
```

#### b. Fungsi `updateInvitation` (WAJIB)

```html
<script>
window.updateInvitation = function(data) {
  // Cover
  if (data['child-nick']) document.getElementById('e-child-nick').textContent = data['child-nick'];
  if (data['child-age']) document.getElementById('e-child-age').textContent = data['child-age'];
  if (data['invite-text']) document.getElementById('e-invite-text').textContent = data['invite-text'];
  if (data['hero-bg']) document.getElementById('e-hero-bg').style.backgroundImage = 'url(' + data['hero-bg'] + ')';
  
  // Profile
  if (data['child-photo']) document.getElementById('e-child-photo').src = data['child-photo'];
  if (data['child-full']) document.getElementById('e-child-full').textContent = data['child-full'];
  if (data['opening-title']) document.getElementById('e-opening-title').textContent = data['opening-title'];
  if (data['opening-message']) document.getElementById('e-opening-message').innerHTML = data['opening-message'];
  
  // Countdown
  if (data['party-date']) {
    PARTY_DATE = new Date(data['party-date']).getTime();
    updateCountdown();
  }
  
  // Event
  if (data['event-date']) document.getElementById('e-event-date').textContent = data['event-date'];
  if (data['event-time']) document.getElementById('e-event-time').textContent = data['event-time'];
  if (data['event-place']) document.getElementById('e-event-place').innerHTML = data['event-place'];
  if (data['event-address']) document.getElementById('e-event-address').innerHTML = data['event-address'];
  if (data['event-maps']) {
    document.getElementById('e-event-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data['event-maps']);
  }
  
  // Gallery
  if (data['gal-1']) document.getElementById('e-gal-1').src = data['gal-1'];
  if (data['gal-2']) document.getElementById('e-gal-2').src = data['gal-2'];
  if (data['gal-3']) document.getElementById('e-gal-3').src = data['gal-3'];
  if (data['gal-4']) document.getElementById('e-gal-4').src = data['gal-4'];
  
  // Gifts
  if (data['bank-name']) document.getElementById('e-bank-name').textContent = data['bank-name'];
  if (data['bank-acc']) document.getElementById('e-bank-acc').textContent = data['bank-acc'];
  if (data['bank-holder']) document.getElementById('e-bank-holder').textContent = data['bank-holder'];
  
  // Closing
  if (data['closing-thanks']) document.getElementById('e-closing-thanks').textContent = data['closing-thanks'];
  if (data['closing-fam']) document.getElementById('e-closing-fam').innerHTML = data['closing-fam'];
};
</script>
```

#### c. PostMessage Listener (WAJIB)

```html
<script>
window.addEventListener('message', function(e) {
  if (e.data.type === 'UPDATE') {
    if (window.updateInvitation) window.updateInvitation(e.data.payload);
  }
});
</script>
```

#### d. Countdown Timer Logic

```html
<script>
let PARTY_DATE;

function updateCountdown() {
  if (!PARTY_DATE) return;
  const now = new Date().getTime();
  const distance = PARTY_DATE - now;
  
  if (distance < 0) {
    ['e-cd-days','e-cd-hours','e-cd-mins','e-cd-secs'].forEach(id => 
      document.getElementById(id).textContent = '00');
    return;
  }
  
  document.getElementById('e-cd-days').textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
  document.getElementById('e-cd-hours').textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('e-cd-mins').textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('e-cd-secs').textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
</script>
```

---

## 2. Menambahkan Editor Sections

### 2.1 Buat Birthday Section Schema

Buat file baru `app/lib/template-schemas/birthday-kids.ts`:

```typescript
import { EditorSection } from '@/app/lib/editor-sections';

export const birthdayKidsSchema: EditorSection[] = [
  {
    id: 'cover',
    title: '1. Cover',
    defaultOpen: true,
    fields: [
      { id: 'child-nick', label: 'Nama Panggilan Anak', type: 'text', defaultValue: 'Leo' },
      { id: 'child-age', label: 'Usia (Tahun ke-)', type: 'text', defaultValue: '5' },
      { id: 'invite-text', label: 'Teks Undangan', type: 'text', defaultValue: 'Kamu Diundang!' },
      { id: 'hero-bg', label: 'Background Cover', type: 'image', defaultValue: '' },
    ],
  },
  {
    id: 'profile',
    title: '2. Profile & Pesan',
    defaultOpen: true,
    fields: [
      { id: 'child-photo', label: 'Foto Anak', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop' },
      { id: 'child-full', label: 'Nama Lengkap', type: 'text', defaultValue: 'Leonard (Leo)' },
      { id: 'opening-title', label: 'Judul Pembuka', type: 'text', defaultValue: 'Halo Teman-teman!' },
      { id: 'opening-message', label: 'Pesan Pembuka', type: 'textarea', defaultValue: 'Leo akan berulang tahun yang ke-5! Kehadiran teman-teman semua akan membuat hari spesial Leo menjadi semakin bahagia.' },
    ],
  },
  {
    id: 'countdown',
    title: '3. Countdown',
    fields: [
      { id: 'party-date', label: 'Tanggal Pesta', type: 'datetime-local', defaultValue: '2026-08-15T15:00' },
    ],
  },
  {
    id: 'event',
    title: '4. Detail Acara',
    fields: [
      { id: 'event-date', label: 'Tanggal', type: 'text', defaultValue: 'Minggu, 15 Agustus 2026' },
      { id: 'event-time', label: 'Waktu', type: 'text', defaultValue: 'Pukul 15.00 WIB - Selesai' },
      { id: 'event-place', label: 'Tempat', type: 'text', defaultValue: 'Taman Bermain Ceria' },
      { id: 'event-address', label: 'Alamat', type: 'text', defaultValue: 'Jl. Pelangi Indah No. 12, Jakarta' },
      { id: 'event-maps', label: 'Link Google Maps', type: 'url', defaultValue: 'https://goo.gl/maps/contoh' },
    ],
  },
  {
    id: 'gallery',
    title: '5. Galeri',
    fields: [
      { id: 'gal-1', label: 'Foto 1', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop' },
      { id: 'gal-2', label: 'Foto 2', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1602083995893-6b71350a4d04?q=80&w=400&auto=format&fit=crop' },
      { id: 'gal-3', label: 'Foto 3', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1545042745-f092040ce2ec?q=80&w=400&auto=format&fit=crop' },
      { id: 'gal-4', label: 'Foto 4', type: 'image', defaultValue: 'https://images.unsplash.com/photo-1628043644026-62111818f99f?q=80&w=400&auto=format&fit=crop' },
    ],
  },
  {
    id: 'gifts',
    title: '6. Tanda Kasih',
    fields: [
      { id: 'bank-name', label: 'Nama Bank', type: 'text', defaultValue: 'BCA' },
      { id: 'bank-acc', label: 'No. Rekening', type: 'text', defaultValue: '1234567890' },
      { id: 'bank-holder', label: 'Atas Nama', type: 'text', defaultValue: 'Orang Tua Leo' },
    ],
  },
  {
    id: 'closing',
    title: '7. Penutup',
    fields: [
      { id: 'closing-thanks', label: 'Teks Terima Kasih', type: 'text', defaultValue: 'Terima Kasih!' },
      { id: 'closing-fam', label: 'Tanda Tangan', type: 'text', defaultValue: 'Leo & Keluarga' },
    ],
  },
];
```

> ⚠️ **Catatan**: Birthday hanya punya 7 section yang bisa diedit (cover, profile, countdown, event, gallery, gifts, closing). Section RSVP dan Wish Wall bersifat fixed di HTML.

### 2.2 Daftarkan Schema di `editor-sections.ts`

Di `app/lib/editor-sections.ts`, tambahkan:

```typescript
import { birthdayKidsSchema } from '@/app/lib/template-schemas/birthday-kids';

export const TEMPLATE_SCHEMAS: Record<string, EditorSection[]> = {
  'Elite Wedding': weddingEliteSchema,
  'Kids Birthday White': birthdayKidsSchema,   // ← TAMBAHKAN INI
};
```

---

## 3. Menambahkan ke Seed Data

Edit `prisma/seed.ts`. Tambahkan object baru ke array `data` di dalam blok `if (existing === 0)`:

```typescript
{
  name: 'Kids Birthday White',
  description: 'Undangan ulang tahun anak dengan tema putih bersih, warna pastel, dan ornamen balon SVG. Cocok untuk pesta ulang tahun anak usia 1-12 tahun.',
  type: 'birthday',
  category: 'birthday',
  theme: 'Kids Pastel',
  thumbnail: '',
  price: 'Free',
  isPopular: false,
  defaultData: JSON.stringify({
    "child-nick": "Leo",
    "child-age": "5",
    "invite-text": "Kamu Diundang!",
    "child-photo": "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop",
    "child-full": "Leonard (Leo)",
    "opening-title": "Halo Teman-teman!",
    "opening-message": "Leo akan berulang tahun yang ke-5!<br>Kehadiran teman-teman semua akan membuat hari spesial Leo menjadi semakin bahagia.",
    "party-date": "2026-08-15T15:00",
    "event-date": "Minggu, 15 Agustus 2026",
    "event-time": "Pukul 15.00 WIB - Selesai",
    "event-place": "Taman Bermain Ceria",
    "event-address": "Jl. Pelangi Indah No. 12, Jakarta",
    "gal-1": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop",
    "gal-2": "https://images.unsplash.com/photo-1602083995893-6b71350a4d04?q=80&w=400&auto=format&fit=crop",
    "gal-3": "https://images.unsplash.com/photo-1545042745-f092040ce2ec?q=80&w=400&auto=format&fit=crop",
    "gal-4": "https://images.unsplash.com/photo-1628043644026-62111818f99f?q=80&w=400&auto=format&fit=crop",
    "bank-name": "BCA",
    "bank-acc": "1234567890",
    "bank-holder": "Orang Tua Leo",
    "closing-thanks": "Terima Kasih!",
    "closing-fam": "Leo & Keluarga",
  }),
},
```

Dan di blok `defaultsMap` (backfill untuk data lama), tambahkan:

```typescript
'Kids Birthday White': JSON.stringify({
  "child-nick": "Leo",
  "child-age": "5",
  "invite-text": "Kamu Diundang!",
  "child-photo": "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop",
  "child-full": "Leonard (Leo)",
  "opening-title": "Halo Teman-teman!",
  "opening-message": "Leo akan berulang tahun yang ke-5!<br>Kehadiran teman-teman semua akan membuat hari spesial Leo menjadi semakin bahagia.",
  "party-date": "2026-08-15T15:00",
  "event-date": "Minggu, 15 Agustus 2026",
  "event-time": "Pukul 15.00 WIB - Selesai",
  "event-place": "Taman Bermain Ceria",
  "event-address": "Jl. Pelangi Indah No. 12, Jakarta",
  "gal-1": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop",
  "gal-2": "https://images.unsplash.com/photo-1602083995893-6b71350a4d04?q=80&w=400&auto=format&fit=crop",
  "gal-3": "https://images.unsplash.com/photo-1545042745-f092040ce2ec?q=80&w=400&auto=format&fit=crop",
  "gal-4": "https://images.unsplash.com/photo-1628043644026-62111818f99f?q=80&w=400&auto=format&fit=crop",
  "bank-name": "BCA",
  "bank-acc": "1234567890",
  "bank-holder": "Orang Tua Leo",
  "closing-thanks": "Terima Kasih!",
  "closing-fam": "Leo & Keluarga",
}),
```

---

## 4. Menambahkan Demo Data

Buat object `DEMO_DATA_KIDS_BIRTHDAY` di `app/lib/templates-config.ts`:

```typescript
export const DEMO_DATA_KIDS_BIRTHDAY: Record<string, string> = {
  'child-nick': 'Leo',
  'child-age': '5',
  'invite-text': 'Kamu Diundang!',
  'hero-bg': '',
  'child-photo': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop',
  'child-full': 'Leonard (Leo)',
  'opening-title': 'Halo Teman-teman!',
  'opening-message': 'Leo akan berulang tahun yang ke-5!<br>Kehadiran teman-teman semua akan membuat hari spesial Leo menjadi semakin bahagia.',
  'party-date': '2026-08-15T15:00',
  'event-date': 'Minggu, 15 Agustus 2026',
  'event-time': 'Pukul 15.00 WIB - Selesai',
  'event-place': 'Taman Bermain Ceria',
  'event-address': 'Jl. Pelangi Indah No. 12, Jakarta',
  'event-maps': 'https://goo.gl/maps/contoh',
  'gal-1': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop',
  'gal-2': 'https://images.unsplash.com/photo-1602083995893-6b71350a4d04?q=80&w=400&auto=format&fit=crop',
  'gal-3': 'https://images.unsplash.com/photo-1545042745-f092040ce2ec?q=80&w=400&auto=format&fit=crop',
  'gal-4': 'https://images.unsplash.com/photo-1628043644026-62111818f99f?q=80&w=400&auto=format&fit=crop',
  'bank-name': 'BCA',
  'bank-acc': '1234567890',
  'bank-holder': 'Orang Tua Leo',
  'closing-thanks': 'Terima Kasih!',
  'closing-fam': 'Leo & Keluarga',
};
```

---

## 5. Menambahkan Key Map (Jika Diperlukan)

### 5.1 Kapan keyMap Diperlukan?

| Skenario | keyMap | Contoh |
|----------|--------|--------|
| `updateInvitation` pakai `data['child-nick']` | ❌ Tidak perlu | Editor kirim `child-nick` → template terima `child-nick` |
| `updateInvitation` pakai `data.childNick` | ✅ Perlu | Editor kirim `child-nick` → template butuh `childNick` |

### 5.2 Contoh keyMap (jika template pakai camelCase)

```typescript
keyMap: {
  'child-nick': 'childNick',
  'child-age': 'childAge',
  'invite-text': 'inviteText',
  'hero-bg': 'heroBg',
  'child-photo': 'childPhoto',
  'child-full': 'childFull',
  'opening-title': 'openingTitle',
  'opening-message': 'openingMessage',
  'party-date': 'partyDate',
  'event-date': 'eventDate',
  'event-time': 'eventTime',
  'event-place': 'eventPlace',
  'event-address': 'eventAddress',
  'event-maps': 'eventMaps',
  'gal-1': 'gal1',
  'gal-2': 'gal2',
  'gal-3': 'gal3',
  'gal-4': 'gal4',
  'bank-name': 'bankName',
  'bank-acc': 'bankAcc',
  'bank-holder': 'bankHolder',
  'closing-thanks': 'closingThanks',
  'closing-fam': 'closingFam',
}
```

---

## 6. Menambahkan ke Template Configs Map

Di `app/lib/templates-config.ts`, tambahkan entry baru ke `TEMPLATE_CONFIGS`:

```typescript
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  // ... template wedding yang sudah ada ...

  'Kids Birthday White': {
    html: KIDS_BIRTHDAY_WHITE_TEMPLATE,
    demoData: DEMO_DATA_KIDS_BIRTHDAY,
    // keyMap: { ... } // hanya jika diperlukan (lihat section 5)
  },
};
```

### 6.1 Proses Escaping HTML

Karena HTML akan ditempatkan di template literal TypeScript (backtick), backtick `` ` `` dan `${` di dalam HTML harus di-escape:

```bash
node -e "
const fs = require('fs');
let html = fs.readFileSync('templates/birthday/kids_birthday_white_theme.html', 'utf8');
let escaped = html.replace(/\\\`/g, '\\\\\`').replace(/\\\$/g, '\\\\$');
fs.writeFileSync('/tmp/escaped_birthday.txt', 'export const KIDS_BIRTHDAY_WHITE_TEMPLATE = \`' + escaped + '\`;');
console.log('Done! Check /tmp/escaped_birthday.txt');
"
```

Kemudian:
1. Copy konstanta dari `/tmp/escaped_birthday.txt`
2. Paste ke `app/lib/templates-config.ts` sebagai `KIDS_BIRTHDAY_WHITE_TEMPLATE`

---

## 7. Menambahkan Template Section Filter

Di `app/lib/editor-sections.ts`, tambahkan filter untuk template birthday ke `TEMPLATE_SECTION_FILTER`:

```typescript
const TEMPLATE_SECTION_FILTER: Record<string, SectionFilter | null> = {
  // ... filter wedding yang sudah ada ...

  'Kids Birthday White': {
    cover: ['child-nick', 'child-age', 'invite-text'],
    profile: null,
    countdown: null,
    event: null,
    gallery: ['gal-1', 'gal-2', 'gal-3', 'gal-4'],
    gifts: null,
    closing: null,
  },
};
```

> ⚠️ **PENTING**: Filter ini hanya menyaring field mana yang muncul di editor untuk setiap section. Section yang tidak disebut dalam filter (seperti `couple`, `groom`, `bride`, `verse`, `story`, `events`, `rsvp`, `stream`, `wishes`) otomatis tidak ditampilkan.

---

## 8. Menambahkan Background Defaults (Opsional)

Jika template birthday mendukung background image, tambahkan ke `BACKGROUND_DEFAULTS` di `app/lib/editor-sections.ts`:

```typescript
export const BACKGROUND_DEFAULTS: Record<string, Record<string, string>> = {
  // ... background wedding yang sudah ada ...

  'Kids Birthday White': {
    'hero-bg': 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1200&auto=format&fit=crop',
  },
};
```

> 💡 Birthday template biasanya hanya punya 1 background (hero/cover). Tidak perlu 6 background seperti wedding.

---

## 9. Database Schema & Field Mapping

### 9.1 Mapping Field Existing ke Birthday

Birthday template bisa menggunakan field `TemplateData` yang sudah ada dengan mapping ulang label:

| Field Existing | Digunakan Sebagai | Default Value |
|---------------|-------------------|---------------|
| `brideNick` | Nama panggilan anak (`child-nick`) | "Leo" |
| `groomFull` | Nama lengkap anak (`child-full`) | "Leonard (Leo)" |
| `groomPhoto` | Foto anak (`child-photo`) | URL foto anak |
| `dateText` | Tanggal acara (`event-date`) | "Minggu, 15 Agustus 2026" |
| `groomDad` | Waktu acara (`event-time`) | "Pukul 15.00 WIB" |
| `groomMom` | Tempat acara (`event-place`) | "Taman Bermain Ceria" |
| `akadPlace` | Alamat acara (`event-address`) | "Jl. Pelangi Indah No. 12" |
| `countdownMaster` | Tanggal countdown (`party-date`) | "2026-08-15T15:00" |
| `gal1` - `gal4` | Galeri foto (4 foto) | URL foto |
| `bankName`, `bankAcc`, `bankHolder` | Tanda kasih (sama) | Sama |
| `closingThanks`, `closingFam` | Penutup (sama) | Sama |

### 9.2 Field yang Tidak Digunakan

Field berikut TIDAK digunakan oleh birthday template:
- `groomNick`, `groomRole`, `groomDad`, `groomMom`
- `brideFull`, `brideRole`, `bridePhoto`, `brideDad`, `brideMom`
- `coupleTitle`, `coupleSub`
- `verseText`, `verseSource`
- `storyDate1`, `storyTitle1`, `storyDesc1`, `storyDate2`, `storyTitle2`, `storyDesc2`
- `akadDate`, `akadTime`, `akadPlace`
- `resepsiDate`, `resepsiTime`, `resepsiPlace`
- `gal5`, `gal6`
- `rsvpTitle`, `rsvpDesc`
- `streamTitle`, `streamDesc`
- `wishesTitle`, `wishesDesc`
- `heroBg`, `coupleBg`, `storyBg`, `galleryBg`, `giftsBg`, `wishesBg`

> ⚠️ **Tidak perlu migrasi DB**: Field-field di atas sudah ada di database, cukup tidak digunakan. Tidak perlu menghapus atau mengubah schema.

---

## 10. Menjalankan Seed & Verifikasi

### 10.1 Seed Template Baru

```bash
# Hapus template sebelumnya (jika perlu)
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.template.deleteMany({ where: { name: 'Kids Birthday White' } }).then(r => { 
  console.log('Deleted:', r.count); 
  p.\$disconnect(); 
}).catch(e => console.error(e));
"

# Seed ulang
npx tsx prisma/seed.ts
```

### 10.2 Sync Schema

```bash
npx prisma db push
```

### 10.3 Typecheck

```bash
npx tsc --noEmit
```

### 10.4 Verifikasi di Browser

1. Login admin → `/admin/templates` → template baru harus muncul
2. Klik **View** → preview harus menampilkan HTML birthday
3. Klik **Edit** → masuk ke editor dengan sections birthday
4. Ubah field di editor → preview harus terupdate realtime
5. Simpan perubahan → data harus tersimpan

---

## 11. Side-by-Side: Birthday vs Wedding

| Aspek | Wedding Template | Birthday Template |
|-------|-----------------|-------------------|
| **Category** | `wedding` | `birthday` |
| **Theme** | Elegant, Modern, Romantic | Kids Pastel, Superhero, Princess |
| **Jumlah section** | 15 | ~10 |
| **Section utama** | Cover, Countdown, Couple, Groom, Bride, Verse, Story, Events, Gallery, RSVP, Gifts, Stream, Wishes, Music, Closing | Cover, Profile, Countdown, Event, Maps, Gallery, RSVP, Wish Wall, Gifts, Closing |
| **Color scheme** | Gold/dark `#0a0807` `#c9a961` | Pastel/cerah `#ffffff` `#88d4f0` `#ffb6c1` |
| **Font** | Cormorant Garamond, Jost | Fredoka, Quicksand |
| **Ornamen** | Partikel emas, vignette | SVG Balon, Awan, Bintang |
| **Gallery** | 6 foto | 4 foto |
| **Events** | Akad + Resepsi | 1 event (party) |
| **Editor theme** | Dark | Light |

---

## 📝 Checklist Final

Sebelum pull request, pastikan:

- [ ] File HTML template selesai dan sudah di-escape
- [ ] Birthday section schema (`birthday-kids.ts`) sudah dibuat
- [ ] Schema didaftarkan di `TEMPLATE_SCHEMAS` (`editor-sections.ts`)
- [ ] Seed data ditambahkan ke `prisma/seed.ts`
- [ ] Demo data (`DEMO_DATA_KIDS_BIRTHDAY`) dibuat di `templates-config.ts`
- [ ] Konstanta HTML (`KIDS_BIRTHDAY_WHITE_TEMPLATE`) ada di `templates-config.ts`
- [ ] Entry `TEMPLATE_CONFIGS` ditambahkan
- [ ] Template section filter ditambahkan (jika perlu)
- [ ] `BACKGROUND_DEFAULTS` ditambahkan (jika ada background)
- [ ] `keyMap` ditambahkan (jika template pakai camelCase)
- [ ] TypeScript kompilasi tanpa error
- [ ] Seed berhasil (`npm run seed`)
- [ ] Template muncul di admin panel
- [ ] Preview dan editor berfungsi
- [ ] Semua file temporary dibersihkan

---

## 🔗 Referensi File

| File | Kegunaan |
|------|----------|
| `templates/birthday/kids_birthday_white_theme.html` | Contoh template birthday yang sudah jadi |
| `template_generator_agents/TEMPLATE_AGENT_BIRTHDAY.md` | Agent guide untuk membuat birthday template |
| `app/lib/template-schemas/birthday-kids.ts` | Schema editor sections untuk birthday |
| `app/lib/templates-config.ts` | Registrasi template + demo data + keyMap |
| `app/lib/editor-sections.ts` | Daftar section editor + filter + background defaults |
| `prisma/seed.ts` | Seed data untuk template |
| `template_generator_agents/TEMPLATE_AGENT.md` | Agent wedding (referensi pola) |
| `agent_seed_template.md` | Panduan seed original (referensi pola) |
