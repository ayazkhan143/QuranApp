import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../src/data/quran.json', import.meta.url), 'utf8'));

const verses = data.pages.flatMap((page) => page.verses);
const juz = new Set(verses.map((verse) => verse.juz));

const checks = [
  [data.surahs.length === 114, '114 surahs'],
  [data.pages.length === 604, '604 pages'],
  [verses.length === 6236, '6,236 ayat'],
  [juz.size === 30, '30 juz'],
  [data.pages.every((page, index) => page.number === index + 1), 'sequential page numbers'],
  [data.pages.every((page) => page.verses.length > 0), 'no empty pages'],
  [verses.every((verse) => verse.arabic && verse.translation), 'complete verse text'],
];

for (const [passed, label] of checks) {
  if (!passed) {
    throw new Error(`Quran data validation failed: ${label}.`);
  }
}

console.log(`Validated ${data.surahs.length} surahs, ${verses.length} ayat, and ${data.pages.length} pages.`);
