# Quran Data Attribution

## Arabic Quran text

The bundled Uthmani Arabic text is retrieved verbatim from
[Al Quran Cloud](https://alquran.cloud), which attributes the text to the
[Tanzil Project](https://tanzil.net).

Tanzil Quran Text — Copyright © 2007–2021 Tanzil Project  
License: [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/)

Permission is granted to copy and distribute verbatim copies of the text. The Quran text must not
be altered. See the complete [Tanzil text license](https://tanzil.net/docs/text_license).

## English translation

The bundled English translation is Mohammed Marmaduke William Pickthall's *The Meaning of the
Glorious Koran*, retrieved from [Al Quran Cloud](https://alquran.cloud). The Pickthall translation
is in the public domain.

## Generated dataset

Run `npm run data:generate` to download the two editions, validate their alignment, and rebuild
`src/data/quran.json`. The generator validates 114 surahs, 6,236 ayat, 30 juz, and all 604 Madani
Mushaf page numbers before writing the bundle.
