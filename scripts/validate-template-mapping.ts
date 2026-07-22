import fs from 'fs';
import path from 'path';

const TEMPLATE_DIR = path.join(process.cwd(), 'templates');
const SCHEMA_DIR = path.join(process.cwd(), 'app', 'lib', 'template-schemas');

interface ValidationResult {
  template: string;
  declaredFields: string[];
  foundElements: string[];
  missingInTemplate: string[];
  unusedInTemplate: string[];
}

function extractSchemaFields(schemaPath: string): string[] {
  const content = fs.readFileSync(schemaPath, 'utf-8');
  const fields: string[] = [];
  const regex = /id:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    fields.push(match[1]);
  }
  return fields;
}

function extractTemplateElements(templatePath: string): string[] {
  const content = fs.readFileSync(templatePath, 'utf-8');
  const fields: string[] = [];
  const regex = /id="e-([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    fields.push(match[1]);
  }
  return fields;
}

function validateTemplate(templateName: string, schemaFields: string[], templateElements: string[]): ValidationResult {
  const declaredFields = schemaFields;
  const foundElements = templateElements;
  const missingInTemplate = declaredFields.filter(f => !foundElements.includes(f));
  const unusedInTemplate = foundElements.filter(f => !declaredFields.includes(f));

  return {
    template: templateName,
    declaredFields,
    foundElements,
    missingInTemplate,
    unusedInTemplate,
  };
}

function main() {
  const schemas = fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith('.ts'));
  const results: ValidationResult[] = [];

  for (const schemaFile of schemas) {
    const templateName = schemaFile.replace('.ts', '').replace(/-/g, ' ');
    const schemaPath = path.join(SCHEMA_DIR, schemaFile);
    const templatePath = path.join(TEMPLATE_DIR, `${schemaFile.replace('.ts', '.html')}`);

    if (!fs.existsSync(templatePath)) {
      console.warn(`⚠ Template file not found for ${templateName}: ${templatePath}`);
      continue;
    }

    const declaredFields = extractSchemaFields(schemaPath);
    const foundElements = extractTemplateElements(templatePath);
    const result = validateTemplate(templateName, declaredFields, foundElements);
    results.push(result);
  }

  let hasErrors = false;

  for (const result of results) {
    console.log(`\n📄 ${result.template}`);
    console.log(`   Declared fields: ${result.declaredFields.length}`);
    console.log(`   Found elements:  ${result.foundElements.length}`);

    if (result.missingInTemplate.length > 0) {
      hasErrors = true;
      console.log(`   ❌ Missing in template HTML`);
      for (const field of result.missingInTemplate) {
        console.log(`      - e-${field}`);
      }
    }

    if (result.unusedInTemplate.length > 0) {
      hasErrors = true;
      console.log(`   ❌ Unused in template HTML (no matching declared field)`);
      for (const field of result.unusedInTemplate) {
        console.log(`      - e-${field}`);
      }
    }

    if (result.missingInTemplate.length === 0 && result.unusedInTemplate.length === 0) {
      console.log(`   ✅ Perfect match`);
    }
  }

  console.log('');
  if (hasErrors) {
    console.error('❌ Validation failed');
    process.exit(1);
  } else {
    console.log('✅ All template mappings valid');
    process.exit(0);
  }
}

main();
