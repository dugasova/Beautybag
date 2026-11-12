// Fails if translation files do not have the same set of keys.
import { readFileSync, readdirSync } from 'node:fs';

const LOCALES_DIR = new URL('../src/locales/', import.meta.url);

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' ? flatten(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

const locales = readdirSync(LOCALES_DIR);
const keys = Object.fromEntries(
  locales.map((locale) => {
    const json = JSON.parse(readFileSync(new URL(`${locale}/translation.json`, LOCALES_DIR), 'utf8'));
    return [locale, new Set(flatten(json))];
  }),
);

const allKeys = new Set(Object.values(keys).flatMap((set) => [...set]));
let failed = false;

for (const locale of locales) {
  const missing = [...allKeys].filter((key) => !keys[locale].has(key));
  if (missing.length) {
    failed = true;
    console.error(`[${locale}] missing ${missing.length} key(s):\n  ${missing.join('\n  ')}`);
  }
}

if (failed) process.exit(1);
console.log(`i18n OK: ${locales.join(', ')} share ${allKeys.size} keys`);
