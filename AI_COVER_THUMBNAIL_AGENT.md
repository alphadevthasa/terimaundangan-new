# AI Agent: Generate Cover Thumbnails for All Templates

Generate 16:9 cover screenshots for every template in the DB and save them as static files served by Next.js.

## Workflow

1. **Create cover route** at `app/api/cover/[id]/route.ts`:
   - Fetch template from Prisma by `id`
   - Get the template's HTML from `TEMPLATE_CONFIGS` / `DEFAULT_TEMPLATE_CONFIG` in `app/lib/templates-config.ts`
   - Server-side replace placeholder text in the cover section with demo data (e.g. `>Bride<` → `>Sienna<`)
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

Both templates have `#s-cover` as the first section at `height: 100vh`. Cover placeholders:

| Template      | Name ID               | Name fallback | Date ID              | Date fallback               |
|---------------|-----------------------|---------------|----------------------|-----------------------------|
| Elite Wedding | `e-bride-nick` / `e-groom-nick` | "Bride" / "Groom" | `e-date-text` | "Date" |
| Honey Wedding | `bride-nick` / `groom-nick`     | "Bride" / "Groom" | `date-text`   | "Saturday, October 24 2026" |

## Demo data keys

- **Elite** (`DEMO_DATA_ELITE`): `bride-nick`, `groom-nick`, `date-text` (kebab-case)
- **Honey** (`DEMO_DATA_HONEY`): `brideName`, `groomName`, `heroDate` (camelCase)

The `keyMap` in `TEMPLATE_CONFIGS` maps kebab → camel for Honey Wedding.

## Sample API response

```
GET /api/cover/e3673f3f-b69e-4ed2-839f-b92b1255ef73
→ 200 text/html (full template HTML with demo data injected)
```

## Run on new template added

1. Get the template ID: `SELECT id, name FROM Template WHERE name = '<name>';`
2. Navigate browser to `/api/cover/<id>` at 1280×720
3. Wait for animations → screenshot → save to `public/covers/<id>.png`
4. `UPDATE Template SET thumbnail = '/covers/<id>.png' WHERE id = '<id>';`
