import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';
import { palette, radius, spacing } from '@/constants/design';
import { juzStartPages, quran } from '@/data';

type IndexView = 'surah' | 'juz';

export default function QuranIndexScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const [view, setView] = useState<IndexView>(params.view === 'juz' ? 'juz' : 'surah');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const surahs = useMemo(
    () =>
      quran.surahs.filter((surah) =>
        [surah.englishName, surah.meaning, String(surah.number)].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      ),
    [normalizedQuery],
  );

  return (
    <Screen>
      <AppText tone="gold" weight="bold" style={styles.overline}>
        THE NOBLE QURAN
      </AppText>
      <AppText weight="bold" style={styles.heading}>
        Read and explore
      </AppText>
      <AppText tone="secondary">114 surahs · 30 juz · 604 Mushaf pages</AppText>

      <View style={styles.segment}>
        <SegmentButton label="Surahs" active={view === 'surah'} onPress={() => setView('surah')} />
        <SegmentButton label="Juz" active={view === 'juz'} onPress={() => setView('juz')} />
      </View>

      {view === 'surah' ? (
        <>
          <View style={styles.search}>
            <Ionicons name="search-outline" size={20} color={palette.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search surah name or number"
              placeholderTextColor={palette.muted}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.list}>
            {surahs.map((surah) => (
              <Pressable
                key={surah.number}
                onPress={() =>
                  router.push({ pathname: '/reader', params: { page: String(surah.startPage) } })
                }
                style={({ pressed }) => [styles.surahCard, pressed && styles.pressed]}>
                <View style={styles.numberBadge}>
                  <AppText tone="gold" weight="bold" style={styles.rotatedNumber}>
                    {surah.number}
                  </AppText>
                </View>
                <View style={styles.surahCopy}>
                  <AppText weight="bold" style={styles.surahName}>
                    {surah.englishName}
                  </AppText>
                  <AppText tone="secondary" style={styles.meta}>
                    {surah.meaning} · {surah.ayahCount} ayat · Page {surah.startPage}
                  </AppText>
                </View>
                <AppText tone="gold" style={styles.arabicName}>
                  {surah.name.replace('سُورَةُ ', '')}
                </AppText>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.juzGrid}>
          {juzStartPages.map((page, index) => (
            <Pressable
              key={index}
              onPress={() => router.push({ pathname: '/reader', params: { page: String(page) } })}
              style={({ pressed }) => [styles.juzCard, pressed && styles.pressed]}>
              <AppText tone="gold" style={styles.juzArabic}>
                الجزء
              </AppText>
              <AppText weight="bold" style={styles.juzNumber}>
                {index + 1}
              </AppText>
              <AppText tone="secondary" style={styles.meta}>
                Starts page {page}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentActive]}>
      <AppText tone={active ? 'gold' : 'secondary'} weight="bold">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overline: {
    marginTop: spacing.sm,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.7,
  },
  heading: {
    fontSize: 30,
    lineHeight: 38,
  },
  segment: {
    marginTop: spacing.xl,
    padding: 4,
    flexDirection: 'row',
    borderRadius: radius.pill,
    backgroundColor: palette.emerald800,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: palette.emerald700,
  },
  search: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.2)',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: palette.white,
    fontSize: 15,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  surahCard: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.18)',
  },
  numberBadge: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.gold,
    transform: [{ rotate: '45deg' }],
  },
  rotatedNumber: {
    transform: [{ rotate: '-45deg' }],
  },
  surahCopy: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  surahName: {
    fontSize: 16,
  },
  meta: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
  },
  arabicName: {
    maxWidth: 88,
    fontFamily: 'AmiriQuran_400Regular',
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'right',
  },
  juzGrid: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  juzCard: {
    width: '48%',
    minHeight: 138,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.25)',
  },
  juzArabic: {
    fontFamily: 'AmiriQuran_400Regular',
    fontSize: 19,
  },
  juzNumber: {
    marginTop: spacing.xs,
    fontSize: 32,
    lineHeight: 38,
  },
  pressed: {
    opacity: 0.75,
  },
});
