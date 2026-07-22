# AI Agent: Background Image Binding for Wedding Templates

Dokumentasi binding background images dari editor ke live preview di iframe.

## Architecture

```
Editor Form (kelola-template/page.tsx)
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

## Files affected

| File | Perubahan |
|------|-----------|
| `app/api/upload/route.ts` | NEW — upload endpoint simpan ke `public/uploads/` |
| `app/dashboard/kelola-template/page.tsx` | Tambah section Backgrounds + BACKGROUND_DEFAULTS + filter section |
| `app/lib/editor-sections.ts` | Tambah section Backgrounds + renumber |
| `prisma/schema/prisma` | Tambah 6 kolom: heroBg, coupleBg, storyBg, galleryBg, giftsBg, wishesBg |
| `app/lib/templates-config.ts` | keyMap entries + updateInvitation + element IDs di HTML template |
| `.gitignore` | Tambah `public/uploads/` |

## Data flow detail

### 1. Upload
- `POST /api/upload` dengan FormData `file`
- Validasi: JPEG/PNG/WebP/GIF, max 5MB
- Simpan ke `public/uploads/{timestamp}-{random}.{ext}`
- Return `{ url: '/uploads/...' }`

### 2. Editor
- Field type `'image'` → render preview + upload button + URL fallback
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

### 4. updateInvitation (iframe side)

Setter pattern untuk setiap template:

**Java Batik, Honey Wedding, Forest Nature** (camelCase keys):
```javascript
if (data.heroBg) document.getElementById('e-heroBg').style.backgroundImage = 'url(' + data.heroBg + ')';
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
};
```

Filter logic di `app/dashboard/kelola-template/page.tsx`:
```typescript
const tmplName = staticTemplate?.name || '';
const hasBackgrounds = !!BACKGROUND_DEFAULTS[tmplName];
const visibleSections = hasBackgrounds
  ? editorSections
  : editorSections.filter(s => s.id !== 'backgrounds');
```

## Adding backgrounds to a new template

1. Add default URLs to `BACKGROUND_DEFAULTS` in `app/dashboard/kelola-template/page.tsx`
2. Add element IDs to background divs in the HTML template (`app/lib/templates-config.ts`)
3. Add background handling to `updateInvitation()` in the template's script
4. Add keyMap entries if template uses keyMap
5. Add DB migration if new background fields are needed
6. Run `prisma db push`

## CSS override behavior

Setting `style.backgroundImage` via JS inline akan override CSS `background`/`background-image` shorthand karena inline style punya specificity lebih tinggi dari CSS class/id selector. Propery lain (`background-size`, `background-position`, filter) tetap dari CSS.
