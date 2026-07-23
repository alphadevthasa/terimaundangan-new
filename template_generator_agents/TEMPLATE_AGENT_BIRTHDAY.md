# AI Agent: Birthday Invitation Template Generator & Editor

> **Panduan lengkap untuk AI Agent dalam membuat, mengedit, dan mengintegrasikan template undangan ulang tahun ke sistem Terima Undangan.**

---

## 📋 Daftar Isi

1. [Perbedaan Fundamental dengan Wedding](#1-perbedaan-fundamental-dengan-wedding)
2. [Arsitektur & UI Rules](#2-arsitektur--ui-rules)
3. [Mandatory Section Structure (Birthday)](#3-mandatory-section-structure-birthday)
4. [Editor Form UI Requirements (Left Pane)](#4-editor-form-ui-requirements-left-pane)
5. [Editor UI Theme & Layout](#5-editor-ui-theme--layout)
6. [Theme & Animation System](#6-theme--animation-system)
7. [HTML Template Requirements](#7-html-template-requirements)
8. [Live Visual Binding JS](#8-live-visual-binding-js)
9. [Key Mapping System](#9-key-mapping-system)
10. [Database Schema Considerations](#10-database-schema-considerations)
11. [Background Images](#11-background-images)
12. [Compliance Checklist](#12-compliance-checklist)

---

## 1. Perbedaan Fundamental dengan Wedding

Birthday template memiliki struktur, estetika, dan konten yang **sangat berbeda** dari wedding template. Jangan mencampuradukkan keduanya.

| Aspek | Wedding Template | Birthday Template |
|-------|-----------------|-------------------|
| **Target** | Pasangan pengantin | Anak / individu berulang tahun |
| **Skema warna** | Gold/dark/elegan `#0a0807`, `#c9a961` | Pastel/cerah `#ffffff`, `#88d4f0`, `#ffb6c1`, `#ffdf85` |
| **Font** | 'Cormorant Garamond', 'Jost', 'Italiana' | 'Fredoka', 'Quicksand' (fun & modern) |
| **Suasana** | Sinematik, mewah, romantis | Ceria, playful, hangat |
| **Section** | 15 section (couple, verse, story, dll) | ~10 section (sederhana, fokus pada anak) |
| **Ornamen** | Partikel emas, film grain, vignette | Balon SVG, awan, bintang, bentuk geometri lucu |
| **Galeri** | 6 foto | 4 foto |
| **Events** | Akad + Resepsi (2 acara) | 1 acara (pesta ulang tahun) |
| **RSVP** | Opsional | Penting (untuk jumlah anak/orang tua) |

---

## 2. Arsitektur & UI Rules

### 2.1 Layout
- **CSS Grid**: 40% left form editor, 60% right preview
- **Device Switcher**: Toggle Mobile (375px) ↔ Desktop (1100px) di panel kanan
- **Iframe Preview**: HTML template diletakkan di `<template id="invitation-template">`, di-inject ke `<iframe>` via `srcdoc`
- **Live Binding**: Form input punya ID → template pakai `e-` prefix → JS `updateInvitation(data)`

### 2.2 Warna & Font Wajib

**Palette Pastel (default):**
```css
--bg-white: #ffffff;
--text-main: #555555;
--pastel-blue: #88d4f0;
--pastel-pink: #ffb6c1;
--pastel-yellow: #ffdf85;
--pastel-mint: #a8e6cf;
--pastel-purple: #dcd3ff;
```

**Fonts:**
```css
/* Heading / Nama anak */
font-family: 'Fredoka', sans-serif;
/* Body text */
font-family: 'Quicksand', sans-serif;
/* Import */
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Quicksand:wght@500;700&display=swap" rel="stylesheet">
```

### 2.3 Dekorasi

Gunakan **SVG inline** (BUKAN emoji) untuk elemen dekoratif:
- Balon (balloon)
- Awan (cloud)
- Bintang (star)
- Kue ulang tahun (cake)
- Gift box
- Confetti

> ⚠️ **LARANGAN**: JANGAN gunakan emoji sebagai ikon/ornamen (`🎈`, `🎂`, `⭐`, dll). Semua ornamen harus SVG.

---

## 3. Mandatory Section Structure (Birthday)

Urutan WAJIB untuk birthday template. Tidak boleh dilewati, digabung, atau diubah urutannya:

### 1. Cover (Hero)
- **Elemen**: Nama anak, Usia/Tahun ke-, Teks undangan ("Kamu Diundang!"), Background ceria
- **Styling**: Cover dengan background image (tanpa overlay gelap), content card putih dengan border dashed
- **Animasi**: Parallax subtle pada background, float animation pada ornamen

### 2. Profile & Opening Message
- **Elemen**: Foto anak (bulat/lingkaran), Nama lengkap anak, Pesan pembuka dari orang tua
- **Styling**: Container putih dengan border radius besar, foto dengan border warna pastel

### 3. Countdown Timer
- **Elemen**: Live countdown (Hari, Jam, Menit, Detik)
- **Logic**: Auto-hitung berdasarkan tanggal pesta yang diinput user
- **Styling**: Box dengan background pastel-purple, shadow lembut

### 4. Event Details
- **Elemen**: Kartu Waktu (tanggal, jam) + Kartu Tempat (nama venue, alamat)
- **Styling**: Grid 2 kolom, card dengan border kuning, hover effect translateY
- **Catatan**: Hanya SATU event (tidak ada akad + resepsi seperti wedding)

### 5. Google Maps
- **Elemen**: Embedded iframe Google Maps + tombol "Buka di Google Maps"
- **Styling**: Map dalam container dengan border mint, shadow lembut

### 6. Photo Gallery
- **Elemen**: Grid 4 foto (BUKAN 6 seperti wedding)
- **Styling**: Grid 2 kolom, aspect-ratio 1:1, border-radius besar

### 7. RSVP
- **Elemen**: Form Nama, Jumlah Kehadiran, Konfirmasi Hadir/Tidak
- **Styling**: Container dengan border biru pastel, tombol pink
- **Form fields**: Nama (text), Jumlah Kehadiran (select: 1/2/3 Orang), Konfirmasi (select: Ya/Maaf)

### 8. Wish Wall / Guest Messages
- **Elemen**: Input nama + pesan, daftar ucapan (mock data), tombol kirim
- **Styling**: Container border kuning, item wish dengan left border kuning

### 9. Gift / Tanda Kasih (Opsional)
- **Elemen**: Bank Name, No. Rekening (dengan tombol Copy), Atas Nama
- **Styling**: Kotak dashed mint, rekening box abu-abu

### 10. Thank You / Closing
- **Elemen**: "Terima Kasih", pesan hangat, tanda tangan keluarga
- **Styling**: Font besar warna pastel-blue

> 💡 **Catatan**: Tidak ada section untuk couple, groom/bride, holy verse, love story, live streaming, atau background music. Ini adalah perbedaan KRUSIAL dengan wedding template.

---

## 4. Editor Form UI Requirements (Left Pane)

Form editor harus menggunakan **Collapsible Accordion Groups**. Grup dan urutan harus persis sama dengan 10 section di atas.

### Form Inputs per Section:

#### 1. Cover
| Field ID | Label | Type |
|----------|-------|------|
| `child-nick` | Nama Panggilan Anak | text |
| `child-age` | Usia (Tahun ke-) | text |
| `invite-text` | Teks Undangan | text |
| `hero-bg` | Background Cover | image |

#### 2. Profile
| Field ID | Label | Type |
|----------|-------|------|
| `child-photo` | Foto Anak | image |
| `child-full` | Nama Lengkap Anak | text |
| `opening-title` | Judul Pembuka | text |
| `opening-message` | Pesan Pembuka | textarea |

#### 3. Countdown
| Field ID | Label | Type |
|----------|-------|------|
| `party-date` | Tanggal Pesta | datetime-local |

#### 4. Event Details
| Field ID | Label | Type |
|----------|-------|------|
| `event-date` | Tanggal Acara | text |
| `event-time` | Waktu Acara | text |
| `event-place` | Tempat Acara | text |
| `event-address` | Alamat Lengkap | text |
| `event-maps` | Link Google Maps | url |

#### 5. Gallery
| Field ID | Label | Type |
|----------|-------|------|
| `gal-1` | Foto 1 | image |
| `gal-2` | Foto 2 | image |
| `gal-3` | Foto 3 | image |
| `gal-4` | Foto 4 | image |

#### 6. Gifts
| Field ID | Label | Type |
|----------|-------|------|
| `bank-name` | Nama Bank | text |
| `bank-acc` | No. Rekening | text |
| `bank-holder` | Atas Nama | text |

#### 7. Closing
| Field ID | Label | Type |
|----------|-------|------|
| `closing-thanks` | Teks Terima Kasih | text |
| `closing-fam` | Tanda Tangan Keluarga | text |

> ⚠️ **Catatan**: Tidak ada field untuk groom/bride, verse, story, stream, couple, atau rsvp-title/desc. Birthday RSVP dan Wish Wall bersifat fixed di template HTML (tidak perlu diedit via form).

---

## 5. Editor UI Theme & Layout

### 5.1 Global Theme

```css
:root {
  --bg: #f8f9fa;          /* Light background */
  --bg-2: #ffffff;         /* Card background */
  --primary: #88d4f0;      /* Pastel blue */
  --accent: #ffb6c1;       /* Pastel pink */
  --text: #555555;         /* Main text */
  --muted: rgba(85,85,85,0.5);
  --line: rgba(136,212,240,0.3);
  --gold: #ffb6c1;         /* Fallback mapping */
}
```

**Catatan**: Editor untuk birthday template menggunakan tema **terang/light** (bukan dark seperti wedding). Ini harus konsisten dengan template undangan yang juga cerah.

### 5.2 Typography

```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Quicksand:wght@500;700&display=swap');

/* Editor headers: Fredoka */
font-family: 'Fredoka', sans-serif;
/* Form labels: Quicksand */
font-family: 'Quicksand', sans-serif;
```

### 5.3 Form Inputs Styling

- Background: `#ffffff`
- Border: `2px solid #e0e0e0`, border-radius: `15px` (rounded/lembut)
- Text Color: `#555555`
- Focus State: Border changes to `--primary` (#88d4f0)
- Padding: `0.6rem 0.8rem`
- Font: 'Quicksand', sans-serif

### 5.4 Accordion Sections

- Summary/Title: Fredoka, color `--primary` (pastel blue)
- Background card putih dengan border-radius 20px
- Separator: Garis tipis antar section
- Section number di depan title

### 5.5 Buttons

- Background: `--accent` (pastel pink) atau `--primary` (pastel blue)
- Text: White, Fredoka
- Border-radius: 20px
- Hover: Transform translateY(-3px), shadow naik

---

## 6. Theme & Animation System

### 6.1 Theme Presets

Birthday template bisa memiliki variasi tema:

| Theme Name | Palette | Font Vibe |
|------------|---------|-----------|
| **Kids Pastel** (default) | Biru, Pink, Kuning, Mint | Fredoka + Quicksand |
| **Superhero** | Merah, Biru, Kuning terang | Bebas Neue + Quicksand |
| **Princess** | Pink, Ungu, Gold | Playfair Display + Quicksand |
| **Dinosaur** | Hijau, Oranye, Coklat | Fredoka + Quicksand |
| **Underwater** | Biru laut, Toska, Coral | Fredoka + Quicksand |

### 6.2 Animasi

Birthday template harus lebih playful dari wedding:

- **Parallax**: Ornamen SVG (balon, awan, bintang) bergerak dengan kecepatan berbeda saat scroll
- **Float animation**: Balon dan ornamen hover naik-turun dengan CSS animation
- **Fade in scroll**: Setiap section muncul dengan fade-in saat di-scroll (Intersection Observer)
- **Confetti effect** (opsional): Partikel confetti di hero section

---

## 7. HTML Template Requirements

### 7.1 Struktur Dasar

File HTML harus memiliki struktur berikut:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Undangan Ulang Tahun [Nama]</title>
  <!-- Google Fonts -->
  <!-- Style -->
</head>
<body>
  <!-- Parallax Ornament Layer (SVG balloons, clouds, stars) -->
  
  <!-- 1. Cover Section -->
  <!-- 2. Profile Section -->
  <!-- 3. Countdown Section -->
  <!-- 4. Event Details Section -->
  <!-- 5. Maps Section -->
  <!-- 6. Gallery Section -->
  <!-- 7. RSVP Section -->
  <!-- 8. Wish Wall Section -->
  <!-- 9. Gift Section -->
  <!-- 10. Thank You Section -->

  <script>
    // updateInvitation function
    // postMessage listener
    // Countdown logic
    // Parallax logic
  </script>
</body>
</html>
```

### 7.2 ID Convention (WAJIB)

Setiap elemen yang bisa diedit harus punya `id` dengan prefix `e-`:

```html
<!-- Teks -->
<span id="e-child-nick">Leo</span>
<span id="e-child-age">5</span>
<span id="e-child-full">Leonard (Leo)</span>

<!-- Gambar -->
<img id="e-child-photo" src="default.jpg" alt="Child Photo">

<!-- innerHTML -->
<div id="e-opening-message">Leo akan berulang tahun yang ke-5...</div>

<!-- Event -->
<span id="e-event-date">Minggu, 15 Agustus 2026</span>
<span id="e-event-time">Pukul 15.00 WIB - Selesai</span>
<span id="e-event-place">Taman Bermain Ceria</span>
<span id="e-event-address">Jl. Pelangi Indah No. 12, Jakarta</span>

<!-- Maps link -->
<a id="e-event-maps" href="...">Buka di Google Maps</a>

<!-- Gallery -->
<img id="e-gal-1" src="...">
<img id="e-gal-2" src="...">
<img id="e-gal-3" src="...">
<img id="e-gal-4" src="...">

<!-- Gifts -->
<span id="e-bank-name">BCA</span>
<div id="e-bank-acc">1234567890</div>
<span id="e-bank-holder">Orang Tua Leo</span>

<!-- Closing -->
<h2 id="e-closing-thanks">Terima Kasih!</h2>
<p id="e-closing-fam">Leo & Keluarga</p>
```

### 7.3 Fungsi `updateInvitation` (WAJIB)

```html
<script>
window.updateInvitation = function(data) {
  // Cover
  if (data['child-nick']) document.getElementById('e-child-nick').textContent = data['child-nick'];
  if (data['child-age']) document.getElementById('e-child-age').textContent = data['child-age'];
  if (data['invite-text']) document.getElementById('e-invite-text').textContent = data['invite-text'];
  
  // Hero background
  if (data['hero-bg']) {
    document.querySelector('.cover-bg').style.backgroundImage = 'url(' + data['hero-bg'] + ')';
  }
  
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
  
  // Event Details
  if (data['event-date']) document.getElementById('e-event-date').textContent = data['event-date'];
  if (data['event-time']) document.getElementById('e-event-time').textContent = data['event-time'];
  if (data['event-place']) document.getElementById('e-event-place').innerHTML = data['event-place'];
  if (data['event-address']) document.getElementById('e-event-address').innerHTML = data['event-address'];
  
  // Maps
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

### 7.4 PostMessage Listener (WAJIB)

```html
<script>
window.addEventListener('message', function(e) {
  if (e.data.type === 'UPDATE') {
    if (window.updateInvitation) {
      window.updateInvitation(e.data.payload);
    }
  }
});
</script>
```

### 7.5 Countdown Logic

```html
<script>
let PARTY_DATE;

function updateCountdown() {
  if (!PARTY_DATE) return;
  const distance = PARTY_DATE - new Date().getTime();
  
  if (distance < 0) {
    document.getElementById("e-cd-days").textContent = "00";
    document.getElementById("e-cd-hours").textContent = "00";
    document.getElementById("e-cd-mins").textContent = "00";
    document.getElementById("e-cd-secs").textContent = "00";
    return;
  }
  
  document.getElementById("e-cd-days").textContent = 
    String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
  document.getElementById("e-cd-hours").textContent = 
    String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
  document.getElementById("e-cd-mins").textContent = 
    String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  document.getElementById("e-cd-secs").textContent = 
    String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
</script>
```

---

## 8. Live Visual Binding JS

### 8.1 Editor-to-Iframe Data Flow

```
Editor Form (React/Next.js)
  ↓ user edits field
  ↓ broadcastToIframe(newData)
  ↓
postMessage({ type: 'UPDATE', payload: newData })
  ↓
iframe → updateInvitation(data)
  ↓ update DOM elements by ID
```

### 8.2 Key Transform (buildIframePayload)

Jika editor menyimpan data dalam format **kebab-case** (`child-nick`, `party-date`) dan template menerima dalam format **camelCase** (`childNick`, `partyDate`), gunakan `keyMap`:

```typescript
keyMap: {
  'child-nick': 'childNick',
  'child-age': 'childAge',
  'child-full': 'childFull',
  'party-date': 'partyDate',
  'event-date': 'eventDate',
  'event-time': 'eventTime',
  'event-place': 'eventPlace',
  'event-maps': 'eventMaps',
  'bank-name': 'bankName',
  'bank-acc': 'bankAcc',
  'bank-holder': 'bankHolder',
}
```

Jika template langsung menggunakan kebab-case di `updateInvitation` (contoh: `data['child-nick']`), maka **tidak perlu keyMap**.

---

## 9. Key Mapping System

### 9.1 Mapping Convention

| Editor Field ID (kebab) | Template updateInvitation key | Contoh value |
|-------------------------|------------------------------|--------------|
| `child-nick` | `child-nick` atau `childNick` | "Leo" |
| `child-age` | `child-age` atau `childAge` | "5" |
| `invite-text` | `invite-text` atau `inviteText` | "Kamu Diundang!" |
| `child-photo` | `child-photo` atau `childPhoto` | URL foto |
| `child-full` | `child-full` atau `childFull` | "Leonard (Leo)" |
| `opening-title` | `opening-title` atau `openingTitle` | "Halo Teman-teman!" |
| `opening-message` | `opening-message` atau `openingMessage` | "Leo akan berulang tahun..." |
| `party-date` | `party-date` atau `partyDate` | "2026-08-15T15:00" |
| `event-date` | `event-date` atau `eventDate` | "Minggu, 15 Agustus 2026" |
| `event-time` | `event-time` atau `eventTime` | "Pukul 15.00 WIB" |
| `event-place` | `event-place` atau `eventPlace` | "Taman Bermain Ceria" |
| `event-address` | `event-address` atau `eventAddress` | "Jl. Pelangi Indah No. 12" |
| `event-maps` | `event-maps` atau `eventMaps` | "Taman Bermain Ceria Jakarta" |
| `gal-1` s.d `gal-4` | `gal-1` s.d `gal-4` | URL gambar |
| `bank-name` | `bank-name` atau `bankName` | "BCA" |
| `bank-acc` | `bank-acc` atau `bankAcc` | "1234567890" |
| `bank-holder` | `bank-holder` atau `bankHolder` | "Orang Tua Leo" |
| `closing-thanks` | `closing-thanks` atau `closingThanks` | "Terima Kasih!" |
| `closing-fam` | `closing-fam` atau `closingFam` | "Leo & Keluarga" |
| `hero-bg` | `hero-bg` atau `heroBg` | Background image URL |

---

## 10. Database Schema Considerations

### 10.1 Current Schema Limitations

Model `TemplateData` di Prisma saat ini memiliki field yang spesifik untuk **wedding** (brideNick, groomNick, dateText, dll). Birthday template membutuhkan field yang berbeda.

**Field yang bisa di-reuse dari schema existing:**
| Existing Field | Mapping ke Birthday | Notes |
|---------------|--------------------|-------|
| `brideNick` | → `child-nick` | Reuse kolom, label diubah |
| `dateText` | → `event-date` | Reuse kolom |
| `groomPhoto` | → `child-photo` | Reuse kolom foto |
| `gal1`-`gal6` | → `gal-1` s.d `gal-4` | 6 kolom → cukup 4 |
| `bankName`, `bankAcc`, `bankHolder` | → Same | Sama persis |
| `closingThanks`, `closingFam` | → Same | Sama persis |
| `countdownMaster` | → `party-date` | Reuse kolom |
| `groomFull` | → `child-full` | Reuse kolom |

**Field baru yang mungkin perlu ditambahkan:**
```prisma
// Di model TemplateData, tambahkan:
childAge    String @default("5")
inviteText  String @default("Kamu Diundang!")
openingTitle String @default("Halo Teman-teman!")
openingMessage String @default("...")
eventTime   String @default("Pukul 15.00 WIB")
eventPlace  String @default("Taman Bermain Ceria")
eventAddress String @default("Jl. Pelangi Indah No. 12")
eventMaps   String @default("")
```

### 10.2 Solusi Praktis (Tanpa Migrasi DB)

Untuk MVP, gunakan field existing yang sudah ada dengan mapping sederhana:

| Existing Field | Digunakan Untuk |
|---------------|-----------------|
| `brideNick` | `child-nick` (nama panggilan anak) |
| `groomNick` | Bisa diabaikan atau untuk nama orang tua |
| `groomFull` | `child-full` (nama lengkap anak) |
| `groomPhoto` | `child-photo` (foto anak) |
| `dateText` | `event-date` (tanggal acara) |
| `groomDad` | `event-time` (waktu acara) |
| `groomMom` | `event-place` (tempat acara) |
| `akadPlace` | `event-address` (alamat lengkap) |
| `akadTime` | `event-time` jika perlu format berbeda |
| `countdownMaster` | `party-date` (tanggal countdown) |
| `gal1`-`gal4` | Gallery (4 foto) |
| `bankName/Acc/Holder` | Gifts (sama) |
| `closingThanks/Fam` | Closing (sama) |

---

## 11. Background Images

Birthday template bisa mendukung background image yang bisa diedit:

| Section | Element | Default Image |
|---------|---------|---------------|
| Cover | `.cover-bg` | https://images.unsplash.com/photo-1530103043960-ef38714abb15 |
| Profile | `.profile-container` | (opsional, bisa putih) |
| Gallery | section background | (opsional) |

Untuk mengaktifkan fitur background, tambahkan `BACKGROUND_DEFAULTS` untuk birthday template:

```typescript
'Kids Birthday White': {
  'hero-bg': 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=2069&auto=format&fit=crop',
}
```

---

## 12. Compliance Checklist

### 🎯 Wajib untuk setiap birthday template baru:

- [ ] Template muncul di halaman list template (`/admin/templates`)
- [ ] Preview HTML menampilkan undangan dengan benar
- [ ] Semua section mengikuti urutan mandatory (10 sections)
- [ ] Semua editable element punya ID dengan prefix `e-`
- [ ] Fungsi `window.updateInvitation()` ada dan berfungsi
- [ ] `postMessage` listener terpasang untuk update live preview
- [ ] Countdown timer bekerja dengan benar
- [ ] Gallery (4 foto) bisa diubah
- [ ] Gifts section bisa diubah (bank, no.rek, holder)
- [ ] Closing text bisa diubah
- [ ] Key mapping benar (jika diperlukan)
- [ ] Tidak ada emoji sebagai ikon/ornamen (gunakan SVG)
- [ ] Menggunakan font Fredoka + Quicksand (bukan Cormorant/Jost)
- [ ] Menggunakan warna pastel (bukan gold/dark)
- [ ] TypeScript kompilasi tanpa error
- [ ] File temporary sudah dibersihkan

### ❌ Larangan:

- JANGAN gunakan section couple/groom/bride
- JANGAN gunakan holy verse atau love story
- JANGAN gunakan gold/dark color scheme
- JANGAN gunakan font Cormorant Garamond atau Jost
- JANGAN gunakan emoji sebagai ornamen
- JANGAN salin struktur wedding template secara mentah

---

## 📚 Referensi

- `agent_seed_template.md` → Panduan integrasi template ke sistem (proses seed, config, escaping)
- `templates/birthday/kids_birthday_white_theme.html` → Contoh birthday template yang sudah jadi
- `template_generator_agents/TEMPLATE_AGENT.md` → Agent wedding (sebagai referensi pola, BUKAN untuk di-copy)
- `app/lib/templates-config.ts` → Tempat registrasi template config
- `app/lib/editor-sections.ts` → Definisi section editor
- `prisma/schema.prisma` → Model TemplateData (untuk field mapping)
