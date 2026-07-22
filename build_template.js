const fs = require('fs');
const path = require('path');

const templatesDir = 'templates';
const outputFile = '/tmp/generated_template_exports.ts';

function findHtmlFiles(dir, list = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findHtmlFiles(full, list);
      } else if (entry.name.endsWith('.html')) {
        list.push(full);
      }
    }
  } catch (e) {
    console.warn(`Cannot read ${dir}: ${e.message}`);
  }
  return list;
}

const files = findHtmlFiles(templatesDir);
console.log(`Found ${files.length} template files`);

function escapeForTemplateLiteral(html) {
  return html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

const lines = files.map(filePath => {
  const fileName = path.basename(filePath, '.html');
  const varName = fileName
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase() + '_TEMPLATE';

  let html = fs.readFileSync(filePath, 'utf8');
  const match = html.match(/<template id="invitation-template">([\s\S]*?)<\/template>/);
  const invitationHtml = match ? match[1].trim() : html;
  const escaped = escapeForTemplateLiteral(invitationHtml);

  return `export const ${varName} = \`${escaped}\`;`;
});

fs.writeFileSync(outputFile, lines.join('\n\n') + '\n', 'utf8');
console.log(`Done! Generated ${lines.length} template exports to ${outputFile}`);
lines.forEach((l, i) => {
  const name = l.match(/export const (\w+)/)?.[1];
  if (name) console.log(`  ${i + 1}. ${name}`);
});
