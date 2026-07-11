import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ARABIC_URL = 'https://api.alquran.cloud/v1/quran/quran-uthmani';
const TRANSLATION_URL = 'https://api.alquran.cloud/v1/quran/en.pickthall';
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/quran.json');

async function fetchEdition(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download Quran data: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (payload.code !== 200 || !payload.data?.surahs) {
    throw new Error('Quran data provider returned an unexpected response.');
  }

  return payload.data;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const [arabic, translation] = await Promise.all([
  fetchEdition(ARABIC_URL),
  fetchEdition(TRANSLATION_URL),
]);

assert(arabic.surahs.length === 114, 'Arabic edition must contain 114 surahs.');
assert(translation.surahs.length === 114, 'Translation must contain 114 surahs.');

const pages = Array.from({ length: 604 }, (_, index) => ({
  number: index + 1,
  verses: [],
}));
const surahs = [];
let verseCount = 0;

arabic.surahs.forEach((surah, surahIndex) => {
  const translatedSurah = translation.surahs[surahIndex];
  assert(surah.number === translatedSurah.number, `Surah mismatch at ${surah.number}.`);
  assert(
    surah.ayahs.length === translatedSurah.ayahs.length,
    `Ayah count mismatch in surah ${surah.number}.`,
  );

  surahs.push({
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    meaning: surah.englishNameTranslation,
    revelationType: surah.revelationType,
    ayahCount: surah.ayahs.length,
    startPage: surah.ayahs[0].page,
    endPage: surah.ayahs.at(-1).page,
  });

  surah.ayahs.forEach((ayah, ayahIndex) => {
    const translatedAyah = translatedSurah.ayahs[ayahIndex];
    assert(ayah.number === translatedAyah.number, `Ayah mismatch at ${ayah.number}.`);
    assert(ayah.page >= 1 && ayah.page <= 604, `Invalid page for ayah ${ayah.number}.`);
    assert(ayah.text.length > 0, `Missing Arabic text for ayah ${ayah.number}.`);
    assert(translatedAyah.text.length > 0, `Missing translation for ayah ${ayah.number}.`);

    pages[ayah.page - 1].verses.push({
      number: ayah.number,
      surah: surah.number,
      ayah: ayah.numberInSurah,
      juz: ayah.juz,
      hizbQuarter: ayah.hizbQuarter,
      sajda: Boolean(ayah.sajda),
      arabic: ayah.text,
      translation: translatedAyah.text,
    });
    verseCount += 1;
  });
});

assert(verseCount === 6236, `Expected 6,236 ayat, received ${verseCount}.`);
assert(pages.every((page) => page.verses.length > 0), 'All 604 pages must contain ayat.');

const output = {
  metadata: {
    arabicEdition: arabic.edition,
    translationEdition: translation.edition,
    source: 'Al Quran Cloud',
    sourceUrl: 'https://alquran.cloud',
    arabicTextAttribution: 'Tanzil Project',
    arabicTextUrl: 'https://tanzil.net',
    pageCount: 604,
    surahCount: 114,
    ayahCount: 6236,
  },
  surahs,
  pages,
};

await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, JSON.stringify(output));
console.log(`Generated ${OUTPUT_PATH} with ${verseCount} ayat across ${pages.length} pages.`);
