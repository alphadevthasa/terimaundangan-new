# AI Agent: Background Image Binding for Wedding Templates

Dokumentasi binding background images dari editor ke live preview di iframe.

## Architecture

Terdapat dua editor path yang menggunakan mekanisme yang sama:

```
Admin Editor (app/admin/templates/[id]/edit/page.tsx)
  ─ atau ─
Customer Editor (app/dashboard/kelola-template/page.tsx)
  ↓  user uploads image (POST /api/upload)
  ↓  URL disimpan ke formData
  ↓
buildIframePayload()
  ↓  transform keys via keyMap (kebab → camel) jika ada
  ↓
postMessage({ type: 'UPDATE', payload })
  ↓
iframe → updateInvitation(data)
  ↓  set element.style.backgroundImage
```

Kedua editor menggunakan shared section definitions dari `app/lib/editor-sections.ts` (setelah fix).

## Files affected

| File | Perubahan |
|------|-----------|
| `app/api/upload/route.ts` | Validasi video MP4/WebM/MOV + limit 50MB |
| `app/dashboard/kelola-template/page.tsx` | Tambah section Backgrounds + BACKGROUND_DEFAULTS + filter section (definisi inline) |
| `app/lib/editor-sections.ts` | Tambah section Backgrounds + `'video'` type + field `hero-video` + renumbering + `backgrounds: null` di `TEMPLATE_SECTION_FILTER` + `BACKGROUND_DEFAULTS` |
| `app/admin/templates/[id]/edit/page.tsx` | Backgrounds via shared `editorSections`; render `type: 'video'` dgn Play button overlay; filter `hero-video` by `templateConfig.supportsVideo` |
| `prisma/schema/prisma` | Tambah 6 kolom: heroBg, coupleBg, storyBg, galleryBg, giftsBg, wishesBg |
| `app/lib/templates-config.ts` | Tambah `supportsVideo`, `TemplateConfig` interface + keyMap + updateInvitation + element IDs video |
| `.gitignore` | Tambah `public/uploads/` |

## Data flow detail

### 1. Upload
- `POST /api/upload` dengan FormData `file`
- Validasi: JPEG/PNG/WebP/GIF, **video/mp4, video/webm, video/quicktime**
- Limit: 5MB (image), 50MB (video)
- Simpan ke `public/uploads/{timestamp}-{random}.{ext}`
- Return `{ url: '/uploads/...' }`

### 2. Editor
- Field type `'image'` → render image preview + upload button
- Field type `'video'` → render `<video>` preview dengan Play button overlay + upload button (accepts MP4/WebM/MOV)
- handleImageUpload → POST /api/upload → set formData
- Data dikirim ke iframe via postMessage

### 3. Key Mapping (`buildIframePayload`)

Tergantung template config:

- **Ada keyMap**: kebab-case (`hero-bg`) → camelCase (`heroBg`)
- **Tidak ada keyMap**: kebab-case dikirim as-is

| Template | keyMap | Data diterima iframe |
|----------|--------|---------------------|
| Elite Wedding | ❌ | `hero-bg` (kebab) |
| Honey Wedding | ✅ | `heroBg` (camel) |
| Java Batik | ✅ | `heroBg` (camel) |
| Forest Nature | ✅ | `heroBg` (camel) |
| West Sumatra | ❌ | `hero-bg` (kebab) |
| Parallax Video Cover | ✅ (gallery-bg, hero-video) | `galleryBg` / `heroVideo` (camel) |

### 4. updateInvitation (iframe side)

Setter pattern untuk setiap template:

**Java Batik, Honey Wedding, Forest Nature** (camelCase keys, via keyMap):
```javascript
if (data.heroBg) document.getElementById('e-heroBg').style.backgroundImage = 'url(' + data.heroBg + ')';
```

**Parallax Video Cover** (camelCase key untuk gallery-bg + hero-video via keyMap):
```javascript
if (data.galleryBg) document.getElementById('e-galleryBg').style.backgroundImage = 'url(' + data.galleryBg + ')';
if (data.heroVideo) {
  document.getElementById('e-hero-video-src').src = data.heroVideo;
  document.getElementById('e-hero-video').load();
}
```

**West Sumatra, Elite Wedding** (kebab-case keys, no keyMap):
```javascript
if (data['hero-bg']) document.getElementById('e-heroBg').style.backgroundImage = 'url(' + data['hero-bg'] + ')';
```

## Per-Template Implementation

### Java Batik ✅ (complete)

6 background divs dengan ID `e-heroBg`, `e-coupleBg`, `e-storyBg`, `e-galleryBg`, `e-giftsBg`, `e-wishesBg`.

| Section | Element | ID |
|---------|---------|-----|
| Hero | `<div class="hero-bg">` | `e-heroBg` |
| Couple | `<div class="parallax-bg">` | `e-coupleBg` |
| Story | `<div class="parallax-bg">` | `e-storyBg` |
| Gallery | `<div class="parallax-bg">` | `e-galleryBg` |
| Gifts | `<div class="parallax-bg">` | `e-giftsBg` |
| Wishes | `<div class="parallax-bg">` | `e-wishesBg` |

### West Sumatra ✅ (complete)

Same pattern as Java Batik. Uses bracket notation `data['hero-bg']` karena tidak punya keyMap.

### Forest Nature ✅ (4 backgrounds)

Background ada di **section elements** yang sudah punya ID, bukan child div:

| Editor field | Maps ke section ID | CSS selector |
|-------------|-------------------|-------------|
| `hero-bg` | `#cover` | `#cover { background-image: url(...) }` |
| `couple-bg` | `#holy-verse` | `#holy-verse { background-image: url(...) }` |
| `story-bg` | `#events` | `#events { background-image: url(...) }` |
| `gallery-bg` | `#closing` | `#closing { background-image: url(...) }` |

> **Catatan**: Forest Nature hanya punya 4 section dengan background. Field `gifts-bg` dan `wishes-bg` tetap muncul di editor tapi tidak ada element di template.

### Parallax Video Cover ⚠️ (partial — only gallery + video)

Template ini punya infrastructure untuk **gallery background** (`e-galleryBg`) dan **hero video** (`e-hero-video` + `e-hero-video-src`). 5 field image background lainnya (`hero-bg`, `couple-bg`, `story-bg`, `gifts-bg`, `wishes-bg`) tidak memiliki element HTML dengan ID `e-` prefix, sehingga tidak bisa di-bind.

| Field | HTML element | updateInvitation | keyMap |
|-------|-------------|-----------------|--------|
| `gallery-bg` | `e-galleryBg` ✅ | ✅ | ✅ |
| `hero-video` | `e-hero-video` + `e-hero-video-src` ✅ | ✅ | ✅ |
| `hero-bg` | `cover-bg` (no `e-` prefix) | ❌ | ❌ |
| `couple-bg` | `couple-bg` (no `e-` prefix) | ❌ | ❌ |
| `story-bg` | `story-bg` (no `e-` prefix) | ❌ | ❌ |
| `gifts-bg` | `gifts-bg` (no `e-` prefix) | ❌ | ❌ |
| `wishes-bg` | `wishes-bg` (no `e-` prefix) | ❌ | ❌ |

**Fix applied**:
- Tambah keyMap `'gallery-bg': 'galleryBg'` + `'hero-video': 'heroVideo'`
- Tambah `id="e-hero-video"` ke `<video>` dan `id="e-hero-video-src"` ke `<source>` di HTML template
- Tambah handler `updateInvitation`: ganti `src` attribute `<source>` + panggil `video.load()`
- Field `hero-video` hanya tampil di editor untuk template dengan `supportsVideo: true`

### Elite Wedding ❌ (no backgrounds)

Message handler diupdate untuk support `key.endsWith('Bg')` atau `key.endsWith('bg')` sebagai generic handler. Tapi template ini tidak punya element background apapun. Section Backgrounds juga **disembunyikan** dari editor.

### Honey Wedding ❌ (no backgrounds)

Tidak punya background images. Section Backgrounds **disembunyikan** dari editor.

## Editor Section Filtering

Section Backgrounds hanya tampil untuk template yang ada di `BACKGROUND_DEFAULTS`:

```typescript
const BACKGROUND_DEFAULTS: Record<string, Record<string, string>> = {
  'Java Batik': { 'hero-bg': '...', 'couple-bg': '...', ... },
  'West Sumatra': { 'hero-bg': '...', 'couple-bg': '...', ... },
  'Forest Nature': { 'hero-bg': '...', 'couple-bg': '...', ... },
  'Parallax Video Cover': { 'gallery-bg': '...' },
};
```

### Shared section definitions (after fix)

Section `backgrounds` didefinisikan di shared `editorSections` (`app/lib/editor-sections.ts`), bukan hanya inline di dashboard. Kedua editor (admin & customer) menggunakannya.

Filter logic di **admin page** (`app/admin/templates/[id]/edit/page.tsx`):
```typescript
const hasBackgrounds = !!BACKGROUND_DEFAULTS[staticTemplateName];
const visibleSections = hasBackgrounds ? editorSections : editorSections.filter(s => s.id !== 'backgrounds');
```

Filter logic di **dashboard page** (`app/dashboard/kelola-template/page.tsx`):
```typescript
const tmplName = staticTemplate?.name || '';
const hasBackgrounds = !!BACKGROUND_DEFAULTS[tmplName];
const visibleSections = hasBackgrounds ? editorSections : editorSections.filter(s => s.id !== 'backgrounds');
```

### Data loading dengan TEMPLATE_SECTION_FILTER

Selain filter UI, `getTemplateSections(tmplName)` menggunakan `TEMPLATE_SECTION_FILTER` untuk menentukan section/field mana yang dimuat dari DB. Agar background fields ikut dimuat, tambahkan `backgrounds: null` ke entry template di `TEMPLATE_SECTION_FILTER`:

```typescript
const TEMPLATE_SECTION_FILTER = {
  'Java Batik': { ..., backgrounds: null },
  'Forest Nature': { ..., backgrounds: null },
  'Parallax Video Cover': { ..., backgrounds: null },
  'West Sumatra': null,  // null = semua section
};
```

Template dengan filter `null` (West Sumatra, Kids Birthday White) otomatis mencakup semua section termasuk backgrounds. Template dengan filter eksplisit harus mencantumkan `backgrounds: null` agar background fields ikut dimuat.

## Adding backgrounds to a new template

1. Add default URLs to `BACKGROUND_DEFAULTS` in `app/lib/editor-sections.ts`
2. Add `backgrounds: null` to `TEMPLATE_SECTION_FILTER` in `app/lib/editor-sections.ts` (jika template punya section filter eksplisit)
3. Add element IDs to background divs in the HTML template (`app/lib/templates-config.ts`)
4. Add background handling to `updateInvitation()` in the template's script
5. Add keyMap entries if template uses keyMap
6. Add DB migration if new background fields are needed
7. Run `prisma db push`

## Video Background Support

### Mekanisme

Template dengan video background (parallax video cover) punya field `hero-video` di section Backgrounds — hanya tampil jika `templateConfig.supportsVideo === true`.

### Data flow video

```
Editor → formData['hero-video'] = 'https://...mp4'
  ↓
buildIframePayload() → keyMap transforms 'hero-video' → 'heroVideo'
  ↓
postMessage({ type: 'UPDATE', payload: { heroVideo: 'https://...mp4' } })
  ↓
iframe updateInvitation:
  data.heroVideo → document.getElementById('e-hero-video-src').src = data.heroVideo
                → document.getElementById('e-hero-video').load()
```

### Menambahkan video ke template baru

1. Set `supportsVideo: true` di `TEMPLATE_CONFIGS` entry template
2. Tambah `<video id="e-hero-video">` + `<source id="e-hero-video-src">` di HTML
3. Tambah handler `if (data.heroVideo) { ... }` di `updateInvitation`
4. Tambah keyMap `'hero-video': 'heroVideo'`
5. Field akan otomatis muncul di editor

## CSS override behavior

Setting `style.backgroundImage` via JS inline akan override CSS `background`/`background-image` shorthand karena inline style punya specificity lebih tinggi dari CSS class/id selector. Propery lain (`background-size`, `background-position`, filter) tetap dari CSS.
