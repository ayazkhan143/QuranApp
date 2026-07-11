import quranJson from './quran.json';

import type { QuranData } from '@/types/quran';

export const quran = quranJson as QuranData;

export const surahByNumber = new Map(quran.surahs.map((surah) => [surah.number, surah]));

export const juzStartPages = Array.from({ length: 30 }, (_, index) => {
  const juz = index + 1;
  return quran.pages.find((page) => page.verses.some((verse) => verse.juz === juz))?.number ?? 1;
});

export function getPage(pageNumber: number) {
  return quran.pages[Math.min(Math.max(pageNumber, 1), quran.metadata.pageCount) - 1];
}

export function getDailyVerse() {
  const day = Math.floor(Date.now() / 86_400_000);
  const page = quran.pages[day % quran.pages.length];
  return page.verses[day % page.verses.length];
}
