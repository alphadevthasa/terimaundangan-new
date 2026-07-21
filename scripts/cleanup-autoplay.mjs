import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fp = resolve(__dirname, '../app/lib/templates-config.ts');
let content = readFileSync(fp, 'utf-8');

const templates = [
  'ELITE_WEDDING_TEMPLATE', 'HONEY_WEDDING_TEMPLATE', 
  'JAVA_BATIK_TEMPLATE', 'FOREST_NATURE_TEMPLATE', 'WEST_SUMATRA_TEMPLATE'
];

for (const name of templates) {
  const decl = `export const ${name} = \``;
  const start = content.indexOf(decl);
  const openBt = content.indexOf('`', start);
  // Find real closing backtick: preceded by </html>
  let closeBt = -1, sp = openBt + 1;
  while (true) {
    const bt = content.indexOf('`', sp);
    if (bt === -1) break;
    if (content.slice(bt - 8, bt).includes('</html>')) { closeBt = bt; break; }
    sp = bt + 1;
  }
  if (closeBt === -1) { console.log(`Skip ${name}`); continue; }

  let t = content.slice(openBt, closeBt + 1);
  const lenBefore = t.length;

  // --- CSS: keep 1st .autoplay-btn block (3 rules), remove rest ---
  const cssStart = '.autoplay-btn {';
  // Count how many CSS blocks
  let cssPositions = [];
  let p = 0;
  while (true) {
    const idx = t.indexOf(cssStart, p);
    if (idx === -1) break;
    // End of the block: after .playing line
    const endOfBlock = t.indexOf('\n', t.indexOf('}', idx + 200)) + 1;
    cssPositions.push({ start: idx, end: endOfBlock });
    p = endOfBlock;
  }
  // Keep only the last one (it was injected at the end, after </style>)
  // Actually, the autoplay CSS is AFTER </style>, so the last occurrence is the "right" position
  // But we want to keep only ONE. Since duplicates were from running inject 3x, 
  // the 3 blocks are adjacent. Keep the first.
  if (cssPositions.length > 1) {
    let removalStart = cssPositions[0].end;
    let removalEnd = cssPositions[cssPositions.length - 1].end;
    t = t.slice(0, removalStart) + t.slice(removalEnd);
  }

  // --- Button: keep 1st, remove rest ---
  const btnStart = '<button id="autoplay-btn"';
  let btnPositions = [];
  p = 0;
  while (true) {
    const idx = t.indexOf(btnStart, p);
    if (idx === -1) break;
    const end = t.indexOf('</button>', idx) + 9;
    btnPositions.push({ start: idx, end });
    p = end;
  }
  if (btnPositions.length > 1) {
    let removalStart = btnPositions[0].end;
    let removalEnd = btnPositions[btnPositions.length - 1].end;
    t = t.slice(0, removalStart) + t.slice(removalEnd);
  }

  // --- Script: keep 1st var autoSections script, remove rest ---
  const scriptStart = '<script>\nvar autoSections';
  let scriptPositions = [];
  p = 0;
  while (true) {
    const idx = t.indexOf(scriptStart, p);
    if (idx === -1) break;
    const end = t.indexOf('</script>', idx) + 9;
    scriptPositions.push({ start: idx, end });
    p = end;
  }
  if (scriptPositions.length > 1) {
    let removalStart = scriptPositions[0].end;
    let removalEnd = scriptPositions[scriptPositions.length - 1].end;
    t = t.slice(0, removalStart) + t.slice(removalEnd);
  }

  content = content.slice(0, openBt) + t + content.slice(closeBt + 1);
  console.log(`${name}: ${lenBefore} → ${t.length}`);
}

writeFileSync(fp, content, 'utf-8');
console.log('\nDone');
