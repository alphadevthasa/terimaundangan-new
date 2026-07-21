// Script to inject autoplay FAB button + JS into all templates
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = resolve(__dirname, '../app/lib/templates-config.ts');
let content = readFileSync(filePath, 'utf-8');

// Autoplay button CSS
const autoPlayCSS = `
        .autoplay-btn { position: fixed; bottom: 80px; right: 20px; width: 44px; height: 44px; background: rgba(10,8,7,.6); border: 1px solid var(--gold); color: var(--gold); border-radius: 50%; cursor: pointer; z-index: 100; display: flex; align-items: center; justify-content: center; font-size: 1rem; backdrop-filter: blur(8px); box-shadow: 0 4px 15px rgba(0,0,0,.3); transition: all .3s; }
        .autoplay-btn:hover { background: var(--gold); color: var(--bg); transform: scale(1.1); }
        .autoplay-btn.playing { background: linear-gradient(135deg,var(--gold),#b8942e); box-shadow: 0 0 20px rgba(201,169,97,.4); }`;

// Autoplay JS template — receives section IDs
function makeAutoPlayJS(sections) {
  return `
<script>
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
<\/script>`;
}

// Autoplay button HTML
const autoPlayBtnHTML = `<button id="autoplay-btn" class="autoplay-btn" onclick="toggleAutoPlay()" aria-label="Toggle Autoplay"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21 6,3"/></svg></button>`;

// Template configurations: [name, section IDs array]
const templates = [
  ['Elite Wedding', ['s-cover','s-countdown','s-couple','s-verse','s-story','s-events','s-gallery','s-rsvp','s-gifts','s-stream','s-wishes','s-closing']],
  ['Honey Wedding', ['hero','opening','couple','story','events','gallery']],
  ['Java Batik', ['cover','countdown-sec','couple','verse','story','events','gallery','rsvp','gifts','streaming','wishes','closing']],
  ['Forest Nature', ['cover','countdown-section','holy-verse','couple','love-story','events','gallery','gifts-stream','rsvp-wishes','closing']],
  ['West Sumatra', ['cover','countdown-sec','couple','verse','story','events','gallery','rsvp','gifts','streaming','wishes','closing']],
];

// For each template, find the closing style tag, music button, and </body>
// and inject autoplay code
for (const [name, sections] of templates) {
  // Find the template variable declaration to scope edits properly
  const varName = name.toUpperCase().replace(/ /g, '_') + '_TEMPLATE';
  const varDecl = `export const ${varName}`;
  const varIdx = content.indexOf(varDecl);
  if (varIdx === -1) { console.error(`Cannot find ${varDecl}`); continue; }
  
  // Find the template content between the opening backtick and closing backtick + ;
  const templateOpen = content.indexOf('`', varIdx);
  // Find the real closing backtick by scanning for one followed by ;\n or ;\r
  let templateClose = -1;
  let searchPos = templateOpen + 1;
  while (true) {
    const bt = content.indexOf('`', searchPos);
    if (bt === -1) break;
    const after = content.slice(bt + 1, bt + 10);
    // The real template closing backtick is preceded by </html> and followed by ;
    if ((/^\s*;/.test(after) || after.startsWith(';')) &&
        content.slice(bt - 20, bt).includes('</html>')) {
      templateClose = bt;
      break;
    }
    searchPos = bt + 1;
  }
  if (templateClose === -1) { console.error(`Cannot find closing backtick in ${name}`); continue; }
  const templateContent = content.slice(templateOpen, templateClose + 1);
  
  // 1. Inject CSS before the last </style>
  const lastStyleClose = templateContent.lastIndexOf('</style>');
  if (lastStyleClose === -1) { console.error(`Cannot find </style> in ${name}`); continue; }
  
  // 2. Inject button before the music button
  // Find the music button HTML (various patterns)
  let musicBtnIdx = -1;
  const musicPatterns = [
    `<button id="audio-btn"`,
    `<button class="music-toggle"`,
    `<button id="music-btn"`,
    `<button class="music-toggle" id="musicToggle"`,
  ];
  for (const pat of musicPatterns) {
    const idx = templateContent.indexOf(pat);
    if (idx !== -1) { musicBtnIdx = idx; break; }
  }
  if (musicBtnIdx === -1) { console.error(`Cannot find music button in ${name}`); continue; }
  
  // 3. Inject JS before </body>
  const bodyCloseIdx = templateContent.lastIndexOf('</body>');
  if (bodyCloseIdx === -1) { console.error(`Cannot find </body> in ${name}`); continue; }
  
  // Build the modified template
  let modified = templateContent.slice(0, lastStyleClose) + '</style>' +
    autoPlayCSS +
    templateContent.slice(lastStyleClose + 8, musicBtnIdx) +
    autoPlayBtnHTML + '\n        ' +
    templateContent.slice(musicBtnIdx, bodyCloseIdx) +
    '\n' + makeAutoPlayJS(sections) + '\n' +
    templateContent.slice(bodyCloseIdx);
  
  // Replace in the full content
  content = content.replace(templateContent, modified);
  
  console.log(`✓ ${name}: injected autoplay (${sections.length} sections)`);
}

writeFileSync(filePath, content, 'utf-8');
console.log('\nDone — file written to ' + filePath);
