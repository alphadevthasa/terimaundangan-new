# Mobile Responsive Dashboard - TODO

## Step 1: `app/dashboard/layout.tsx` - Mobile Layout
- [x] Add `isMobile` detection (`window.innerWidth < 768`)
- [x] Mobile: Hide Sidebar, add bottom navigation bar with 4 menu items
- [x] Mobile Header: Logo + hamburger menu (user info + logout)
- [x] Desktop: Keep current behavior unchanged

## Step 2: `app/dashboard/kelola-template/page.tsx` - Mobile Editor
- [ ] Add `isMobile` detection
- [ ] Mobile: Editor panel full width
- [ ] "Save Changes" → "Save" text, Save + Share 50% each
- [ ] Add "Preview" button below Save/Share
- [ ] Preview mode: Full-screen iframe with Back button
- [ ] Desktop: Keep current behavior unchanged

## Step 3: Testing
- [ ] Test mobile view (< 768px) on all dashboard pages
- [ ] Test desktop view (> 768px) unchanged
- [ ] Test Preview mode in kelola-template on mobile
