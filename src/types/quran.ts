export type QuranVerse = {
  number: number;
  surah: number;
  ayah: number;
  juz: number;
  hizbQuarter: number;
  sajda: boolean;
  arabic: string;
  translation: string;
};

export type QuranPage = {
  number: number;
  verses: QuranVerse[];
};

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  meaning: string;
  revelationType: 'Meccan' | 'Medinan';
  ayahCount: number;
  startPage: number;
  endPage: number;
};

export type QuranData = {
  metadata: {
    source: string;
    sourceUrl: string;
    arabicTextAttribution: string;
    arabicTextUrl: string;
    pageCount: number;
    surahCount: number;
    ayahCount: number;
  };
  surahs: Surah[];
  pages: QuranPage[];
};
