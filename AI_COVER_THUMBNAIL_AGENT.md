# AI Agent: Generate Cover Thumbnails for All Templates

Generate 16:9 cover screenshots for every template in the DB and save them as static files served by Next.js.

## Workflow

1. **Create cover route** at `app/api/cover/[id]/route.ts`:
   - Fetch template from Prisma by `id`
   - Get the template's HTML from `TEMPLATE_CONFIGS` / `DEFAULT_TEMPLATE_CONFIG` in `app/lib/templates-config.ts`
   - Server-side replace placeholder text in the cover section with demo data
   - Inject a `<script>` that calls `window.updateInvitation(data)` + `postMessage({ type: 'UPDATE', payload })` on `DOMContentLoaded`
   - Return HTML as `text/html`

2. **Screenshot each cover**:
   - Navigate the browser to `/api/cover/<templateId>` for each template
   - Set viewport to 1280×720 (exactly matches `100vh` cover section height)
   - Wait for fade-in animations to complete (~4s for Honey Wedding, ~1s for others)
   - Save as PNG to `public/covers/<templateId>.png`

3. **Update DB records**:
   ```sql
   UPDATE Template SET thumbnail = '/covers/<templateId>.png' WHERE id = '<templateId>';
   ```

## Files involved

- New: `app/api/cover/[id]/route.ts`
- New: `public/covers/*.png` (generated screenshots)
- Modified: `Template.thumbnail` column in DB (set to `/covers/<id>.png`)
- Consumed by: `app/checkout/[id]/page.tsx` (shows the cover if `template.thumbnail` is non-empty)

## Template HTML structure

All templates have a cover section at `height: 100vh` (or equivalent full-screen layout).

| Template | Section ID | Name IDs | Date ID | Key Map (kebab→camel) |
|---|---|---|---|---|
| Elite Wedding | `#s-cover` | `e-bride-nick`, `e-groom-nick` | `e-date-text` | none (uses kebab directly) |
| Honey Wedding | `#hero` | `e-bride-name`, `e-groom-name` | `e-hero-date` | `bride-name`→`brideName`, `groom-name`→`groomName`, `date-text`→`heroDate` |
| Forest Nature | `#cover` | `e-bride-name`, `e-groom-name` | — | `brideName`, `groomName` |
| Java Batik | `#cover` | `e-bride-name`, `e-groom-name` | `e-hero-date` | `brideName`, `groomName` |
| West Sumatra | `#cover` | none (hardcoded "Raka" / "Sri") | `hero-date` | `bride-nick`→`brideName`, `groom-nick`→`groomName` |
| Cover Video | `#cover` | `e-bride-name`, `e-groom-name` | `e-date-text` | `heroDate` |

## Cover placeholder replacement rules

The `app/api/cover/[id]/route.ts` handles all templates with these replacements:

```typescript
const coverReplacements: Record<string, string> = {};

// Elite Wedding (kebab-case, e- prefix)
if (d['bride-nick']) coverReplacements['id="e-bride-nick">Bride'] = `id="e-bride-nick">${d['bride-nick']}`;
if (d['groom-nick']) coverReplacements['id="e-groom-nick">Groom'] = `id="e-groom-nick">${d['groom-nick']}`;
if (d['date-text']) coverReplacements['id="e-date-text">Date'] = `id="e-date-text">${d['date-text']}`;

// Honey Wedding (camelCase via keyMap)
if (d.brideName) coverReplacements['id="e-bride-name">Sienna'] = `id="e-bride-name">${d.brideName}`;
if (d.groomName) coverReplacements['id="e-groom-name">Arka'] = `id="e-groom-name">${d.groomName}`;
if (d.heroDate) coverReplacements['id="e-hero-date">20 . 12 . 2025'] = `id="e-hero-date">${d.heroDate}`;

// Forest Nature (camelCase)
if (d.brideName) coverReplacements['id="e-bride-name">Elena'] = `id="e-bride-name">${d.brideName}`;
if (d.groomName) coverReplacements['id="e-groom-name">Arthur'] = `id="e-groom-name">${d.groomName}`;

// Java Batik (camelCase)
if (d.brideName) coverReplacements['id="e-bride-name">Sekarwangi'] = `id="e-bride-name">${d.brideName}`;
if (d.groomName) coverReplacements['id="e-groom-name">Baskoro'] = `id="e-groom-name">${d.groomName}`;
if (d.heroDate) coverReplacements['id="e-hero-date">Sabtu, 20 Desember 2025'] = `id="e-hero-date">${d.heroDate}`;

// West Sumatra (hardcoded, no id attributes on name spans)
// Uses hero-date class: replace "Sabtu, 20 Desember 2025" with demo data
if (d.heroDate) coverReplacements['>Sabtu, 20 Desember 2025<'] = `>${d.heroDate}<`;

// Cover Video (camelCase)
if (d.brideName) coverReplacements['id="e-bride-name">Amanda'] = `id="e-bride-name">${d.brideName}`;
if (d.groomName) coverReplacements['id="groom-name">Rizky'] = `id="e-groom-name">${d.groomName}`;
if (d.heroDate) coverReplacements['id="e-date-text">12 . 12 . 2026'] = `id="e-date-text">${d.heroDate}`;
```

## Demo data keys

| Template | Demo Data Export | Keys (camelCase after keyMap) |
|---|---|---|
| Elite Wedding | `DEMO_DATA_ELITE` | `bride-nick`, `groom-nick`, `date-text` (raw kebab) |
| Honey Wedding | `DEMO_DATA_HONEY` | `brideName`, `groomName`, `heroDate` |
| Forest Nature | `DEMO_DATA_FOREST_NATURE` | `brideName`, `groomName` |
| Java Batik | `DEMO_DATA_JAVA_BATIK` | `brideName`, `groomName`, `heroDate` |
| West Sumatra | `DEMO_DATA_WEST_SUMATRA` | `bride-nick`→`brideName`, `groom-nick`→`groomName`, `heroDate` |
| Cover Video | (uses `DEMO_DATA_ELITE`) | `brideName`, `groomName`, `heroDate` |

## Sample API response

```
GET /api/cover/<templateId>
→ 200 text/html (full template HTML with demo data injected)
```

## Run on new template added

1. Get the template ID: `SELECT id, name FROM Template WHERE name = '<name>';`
2. Add replacement rules to `app/api/cover/[id]/route.ts` for the new template's cover placeholders
3. Navigate browser to `/api/cover/<id>` at 1280×720
4. Wait for animations → screenshot → save to `public/covers/<id>.png`
5. `UPDATE Template SET thumbnail = '/covers/<id>.png' WHERE id = '<id>';`

## Notes

- **West Sumatra**: Name spans don't have `id` attributes, so replacement uses `>text<` pattern matching. The hero-date uses class `hero-date` not `id`.
- **Honey Wedding**: Has parallax layers; animations take ~4s to settle.
- **Cover Video**: Uses `<section id="cover">` with video background; poster image loads first.
- **Forest Nature**: Uses parallax with `data-depth` layers.
