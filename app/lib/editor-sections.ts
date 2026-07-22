import { weddingEliteSchema } from '@/app/lib/template-schemas/wedding-elite';

export interface EditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'datetime-local' | 'number' | 'select' | 'image';
  defaultValue: string;
  options?: { value: string; label: string }[];
}

export interface EditorSection {
  id: string;
  title: string;
  defaultOpen?: boolean;
  fields: EditorField[];
}

export const editorSections: EditorSection[] = [];

export const TEMPLATE_SCHEMAS: Record<string, EditorSection[]> = {
  'Elite Wedding': weddingEliteSchema,
};

type SectionFilter = Record<string, string[] | null>;

const TEMPLATE_SECTION_FILTER: Record<string, SectionFilter | null> = {
  'Honey Wedding': {
    cover: ['bride-nick', 'groom-nick', 'date-text'],
    countdown: null,
    groom: ['groom-full', 'groom-photo'],
    bride: ['bride-full', 'bride-photo'],
    events: null,
    gallery: null,
  },
  'Forest Nature': {
    cover: ['bride-nick', 'groom-nick'],
    countdown: null,
    verse: null,
    groom: ['groom-photo'],
    bride: ['bride-photo'],
    events: null,
    gallery: ['gal-1', 'gal-2', 'gal-3', 'gal-4'],
    gifts: null,
    closing: ['closing-thanks'],
  },
  'Java Batik': {
    cover: null,
    countdown: null,
    groom: ['groom-full', 'groom-photo'],
    bride: ['bride-full', 'bride-photo'],
    events: null,
    gallery: null,
    gifts: null,
    closing: null,
  },
  'West Sumatra': null,
};

export const BACKGROUND_DEFAULTS: Record<string, Record<string, string>> = {
  'Java Batik': {
    'hero-bg': 'https://images.unsplash.com/photo-1564419320508-2e3d3a7d7bf5?q=80&w=1200&auto=format&fit=crop',
    'couple-bg': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&auto=format&fit=crop',
    'story-bg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&auto=format&fit=crop',
    'gallery-bg': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&auto=format&fit=crop',
    'gifts-bg': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&auto=format&fit=crop',
    'wishes-bg': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&auto=format&fit=crop',
  },
  'West Sumatra': {
    'hero-bg': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    'couple-bg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&auto=format&fit=crop',
    'story-bg': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&auto=format&fit=crop',
    'gallery-bg': 'https://images.unsplash.com/photo-1431440869543-efaf3388c585?q=80&auto=format&fit=crop',
    'gifts-bg': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&auto=format&fit=crop',
    'wishes-bg': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&auto=format&fit=crop',
  },
  'Forest Nature': {
    'hero-bg': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1920&auto=format&fit=crop',
    'couple-bg': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop',
    'story-bg': 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop',
    'gallery-bg': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1920&auto=format&fit=crop',
  },
};

export function getTemplateSections(templateName: string): EditorSection[] {
  const schema = TEMPLATE_SCHEMAS[templateName];
  if (schema) return schema;

  const filter = TEMPLATE_SECTION_FILTER[templateName];
  if (!filter) return editorSections;

  const result: EditorSection[] = [];

  for (const section of editorSections) {
    const fieldFilter = filter[section.id];
    if (fieldFilter === undefined) continue;

    result.push({
      ...section,
      fields: fieldFilter === null
        ? section.fields
        : section.fields.filter(f => fieldFilter.includes(f.id)),
    });
  }

  return result;
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}
