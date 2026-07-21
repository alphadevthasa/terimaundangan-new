export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// Fill Customer create/update data from kebab-case defaultData JSON
export function defaultDataToCustomer(data: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    out[kebabToCamel(k)] = v;
  }
  return out;
}

const FALLBACK: Record<string, string> = {
  brideNick: 'Bride',
  groomNick: 'Groom',
  dateText: 'Saturday, October 24th, 2026',
  countdownMaster: '2026-10-24T10:00',
  coupleTitle: 'Two Souls, One Heart',
  coupleSub: 'We invite you to share in our joy as we exchange our vows and begin our new life together.',
};

export function customerDefaults(defaultData: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  try { Object.assign(parsed, JSON.parse(defaultData)); } catch {}
  const camel = defaultDataToCustomer(parsed);
  return { ...FALLBACK, ...camel };
}
