// Rebuild the browser dictionary after editing dist/locales/{de,es,fr}.json.
import {readFileSync, writeFileSync} from 'node:fs';
const root = new URL('../dist/', import.meta.url);
const translations = Object.fromEntries(['de','es','fr'].map(lang => [lang, JSON.parse(readFileSync(new URL(`locales/${lang}.json`, root), 'utf8'))]));
const keys = Object.keys(translations.de).sort();
for (const [lang, dictionary] of Object.entries(translations)) {
  if (JSON.stringify(Object.keys(dictionary).sort()) !== JSON.stringify(keys)) throw new Error(`Missing or extra translation keys in ${lang}`);
  if (Object.values(dictionary).some(value => typeof value !== 'string' || !value.trim())) throw new Error(`Empty translation in ${lang}`);
}
writeFileSync(new URL('translations.js', root), '/* Local translations; no visitor data is sent to a translation service. */\nwindow.FLUIDTECH_TRANSLATIONS = '+JSON.stringify(translations)+';\n');
console.log(`Built ${keys.length} translations for each of German, Spanish and French.`);
