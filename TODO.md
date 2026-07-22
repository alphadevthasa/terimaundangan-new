# Mobile Responsive Dashboard - TODO

## Step 1: `app/dashboard/layout.tsx` - Mobile Layout
- [x] Add `isMobile` detection (`window.innerWidth < 768`)
- [x] Mobile: Hide Sidebar, add bottom navigation bar with 4 menu items
- [x] Mobile Header: Logo + hamburger menu (user info + logout)
- [x] Desktop: Keep current behavior unchanged

## Step 2: `app/dashboard/kelola-template/page.tsx` - Mobile Editor
- [x] Add `windowIsMobile` detection
- [x] Mobile: Editor panel full width
- [x] "Save Changes" → "Save" text, Save + Share 50% each
- [x] Add "Preview" button below Save/Share
- [x] Preview mode: Full-screen iframe with Back button
- [x] Desktop: Keep current behavior unchanged

## Step 3: ✅ Testing
- [x] Test mobile view (< 768px) on all dashboard pages
- [x] Test desktop view (> 768px) unchanged
- [x] Test Preview mode in kelola-template on mobile

---

## Feature: Generate Publish URL
- [x] API route: `PATCH /api/template-data/publish` — generate unique slug, set published=true
- [x] Button "Generate Publish URL" di editor kelola-template
- [x] Tampilkan URL + Copy button setelah publish
- [x] Share button otomatis pakai publish URL asli

## Feature: Unpublish & Regenerate URL
- [x] API route: `PATCH /api/template-data/unpublish` — set published=false
- [x] Tombol Unpublish (red, dengan confirm dialog)
- [x] Tombol Regenerate URL (gold, dengan confirm dialog)

## Feature: Published Status di List Template
- [x] Status badge "Published" / "Draft" di kartu template
- [x] Link slug + Copy button jika published
