// Re-inject autoplay CSS INSIDE </style> and button/JS properly
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fp = resolve(__dirname, '../app/lib/templates-config.ts');
let content = readFileSync(fp, 'utf-8');

const autoPlayCSS = `
        /* autoplay FAB */
        .autoplay-btn { position: fixed; bottom: 80px; right: 20px; width: 44px; height: 44px; background: rgba(10,8,7,.6); border: 1px solid var(--gold); color: var(--gold); border-radius: 50%; cursor: pointer; z-index: 100; display: flex; align-items: center; justify-content: center; font-size: 1rem; backdrop-filter: blur(8px); box-shadow: 0 4px 15px rgba(0,0,0,.3); transition: all .3s; }
        .autoplay-btn:hover { background: var(--gold); color: var(--bg); transform: scale(1.1); }
        .autoplay-btn.playing { background: linear-gradient(135deg,var(--gold),#b8942e); box-shadow: 0 0 20px rgba(201,169,97,.4); }`;

// Section IDs per template
const sectionsMap = {
  'ELITE_WEDDING_TEMPLATE': ['s-cover','s-countdown','s-couple','s-verse','s-story','s-events','s-gallery','s-rsvp','s-gifts','s-stream','s-wishes','s-closing'],
  'HONEY_WEDDING_TEMPLATE': ['hero','opening','couple','story','events','gallery'],
  'JAVA_BATIK_TEMPLATE': ['cover','countdown-sec','couple','verse','story','events','gallery','rsvp','gifts','streaming','wishes','closing'],
  'FOREST_NATURE_TEMPLATE': ['cover','countdown-section','holy-verse','couple','love-story','events','gallery','gifts-stream','rsvp-wishes','closing'],
  'WEST_SUMATRA_TEMPLATE': ['cover','countdown-sec','couple','verse','story','events','gallery','rsvp','gifts','streaming','wishes','closing'],
};

// First: remove any existing autoplay injections (from previous runs)
// Remove CSS blocks that are outside <style> (after </style>)
// Pattern: </style>\n        /* autoplay FAB */... -> replace with </style>
content = content.replace(/<\/style>\s*\/\* autoplay FAB \*\/[\s\S]*?\.autoplay-btn\.playing[\s\S]*?\n\s*/g, '</style>\n');

// Remove any autoplay button HTML and script blocks
content = content.replace(/<button id="autoplay-btn".*?<\/button>\s*/g, '');
content = content.replace(/<script>\s*var autoSections[\s\S]*?<\/script>\s*/g, '');

// Now re-inject properly
const templates = Object.keys(sectionsMap);

for (const name of templates) {
  const sections = sectionsMap[name];
  const decl = `export const ${name} = \``;
  const start = content.indexOf(decl);
  const openBt = content.indexOf('`', start);
  
  let closeBt = -1, sp = openBt + 1;
  while (true) {
    const bt = content.indexOf('`', sp);
    if (bt === -1) break;
    if (content.slice(bt - 8, bt).includes('</html>')) { closeBt = bt; break; }
    sp = bt + 1;
  }
  if (closeBt === -1) { console.log(`Skip ${name}`); continue; }

  let t = content.slice(openBt, closeBt + 1);

  // 1. Inject CSS before the last </style>
  const lastStyleClose = t.lastIndexOf('</style>');
  if (lastStyleClose === -1) { console.log(`Skip ${name}: no </style>`); continue; }
  t = t.slice(0, lastStyleClose) + autoPlayCSS + '\n        ' + t.slice(lastStyleClose);

  // 2. Find the music button and inject autoplay button before it
  const musicBtn = t.indexOf(`<button id="audio-btn"`) !== -1 
    ? t.indexOf(`<button id="audio-btn"`)
    : t.indexOf('<button class="music-toggle"');
  
  if (musicBtn === -1) { console.log(`Skip ${name}: no music btn`); continue; }
  
  const autoPlayHTML = `        <button id="autoplay-btn" class="autoplay-btn" onclick="toggleAutoPlay()" aria-label="Toggle Autoplay"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21 6,3"/></svg></button>\n`;
  t = t.slice(0, musicBtn) + autoPlayHTML + t.slice(musicBtn);

  // 3. Inject autoplay JS before </body>
  const bodyClose = t.lastIndexOf('</body>');
  if (bodyClose === -1) { console.log(`Skip ${name}: no </body>`); continue; }
  
  const autoPlayJS = `<script>
var autoSections = ${JSON.stringify(sections)};
var autoInterval = null, autoPlaying = false, autoIdx = 0;
function toggleAutoPlay() {
  if (autoPlaying) { clearInterval(autoInterval); autoPlaying = false;
    document.getElementById('autoplay-btn').classList.remove('playing');
    document.getElementById('autoplay-btn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21 6,3"/></svg>';
    return; }
  autoPlaying = true; autoIdx = 0;
  document.getElementById('autoplay-btn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/></svg>';
  document.getElementById('autoplay-btn').classList.add('playing');
  var el = document.getElementById(autoSections[0]);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  autoIdx = 1;
  autoInterval = setInterval(function() {
    var el = document.getElementById(autoSections[autoIdx]);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    autoIdx = (autoIdx + 1) % autoSections.length;
  }, 4000);
}
window.addEventListener('beforeunload', function() { if (autoInterval) clearInterval(autoInterval); });
<\/script>\n`;
  t = t.slice(0, bodyClose) + autoPlayJS + t.slice(bodyClose);

  content = content.slice(0, openBt) + t + content.slice(closeBt + 1);
  console.log(`${name}: injected (${sections.length} sections)`);
}

writeFileSync(fp, content, 'utf-8');
console.log('\nDone');
