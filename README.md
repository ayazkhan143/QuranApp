# Quran App

A production-focused, local-first Quran reader built with Expo SDK 57, React Native, Expo Router,
and TypeScript.

## Included

- Complete Uthmani Arabic Quran text: 114 surahs and 6,236 ayat
- Pickthall English translation
- Madani Mushaf pagination across all 604 pages
- Horizontal page swiping with previous/next controls
- Surah search and 30-juz index
- Persistent reading progress, page bookmarks, theme, translation, and Arabic-size preferences
- Reusable emerald-and-gold Islamic frames, cards, and artwork placeholders
- Android, iOS, and static web support

The Arabic text is bundled for offline reading and is not modified by the application. See
[QURAN_DATA_LICENSE.md](./QURAN_DATA_LICENSE.md) for attribution and licensing.

## Requirements

- Node.js 22.17 or newer
- npm 10 or newer

## Setup

```bash
npm install
```

## Development

```bash
npm start
npm run android
npm run ios
npm run web
```

## Quality checks

```bash
npm run data:validate
npm run lint
npm run typecheck
npm run build:web
```

## Quran data

The checked-in `src/data/quran.json` makes the core reading experience offline-first. To rebuild it
from the attributed providers:

```bash
npm run data:generate
npm run data:validate
```

The generator rejects incomplete or misaligned editions and verifies the canonical app-level
invariants: 114 surahs, 6,236 ayat, 30 juz, and 604 non-empty pages.
