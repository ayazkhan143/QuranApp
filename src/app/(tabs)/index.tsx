import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ArtworkPlaceholder } from '@/components/artwork-placeholder';
import { IslamicFrame } from '@/components/islamic-frame';
import { Screen } from '@/components/screen';
import { SectionHeading } from '@/components/section-heading';
import { palette, radius, spacing } from '@/constants/design';
import { useReader } from '@/context/reader-context';
import { getDailyVerse, getPage, surahByNumber } from '@/data';

export default function HomeScreen() {
  const { lastPage } = useReader();
  const currentPage = getPage(lastPage);
  const currentSurah = surahByNumber.get(currentPage.verses[0].surah);
  const dailyVerse = getDailyVerse();
  const dailySurah = surahByNumber.get(dailyVerse.surah);
  const progress = Math.round((lastPage / 604) * 100);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <AppText tone="gold" weight="bold" style={styles.overline}>
            ASSALAMU ALAIKUM
          </AppText>
          <AppText weight="bold" style={styles.heading}>
            Quran
          </AppText>
          <AppText tone="secondary">Read, reflect, and return every day.</AppText>
        </View>
        <View style={styles.brandMark}>
          <Ionicons name="sparkles" size={22} color={palette.goldLight} />
        </View>
      </View>

      <Pressable
        onPress={() => router.push({ pathname: '/reader', params: { page: String(lastPage) } })}
        style={({ pressed }) => pressed && styles.pressed}>
        <LinearGradient
          colors={[palette.emerald700, palette.emerald800]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.continueCard}>
          <View style={styles.continueCopy}>
            <AppText tone="gold" weight="bold" style={styles.overline}>
              CONTINUE READING
            </AppText>
            <AppText weight="bold" style={styles.continueTitle}>
              {currentSurah?.englishName}
            </AppText>
            <AppText tone="secondary">
              Page {lastPage} · Juz {currentPage.verses[0].juz}
            </AppText>
            <View style={styles.progressTrack}>
              <View style={[styles.progressValue, { width: `${Math.max(progress, 2)}%` }]} />
            </View>
            <AppText tone="gold" weight="medium" style={styles.progressLabel}>
              {progress}% of the Mushaf
            </AppText>
          </View>
          <ArtworkPlaceholder icon="book-outline" />
        </LinearGradient>
      </Pressable>

      <SectionHeading eyebrow="Begin" title="Quick access" />
      <View style={styles.quickGrid}>
        <QuickAction
          icon="book-outline"
          title="Read Quran"
          subtitle="604 pages"
          onPress={() => router.push('/quran')}
        />
        <QuickAction
          icon="grid-outline"
          title="Browse Juz"
          subtitle="30 sections"
          onPress={() => router.push({ pathname: '/quran', params: { view: 'juz' } })}
        />
        <QuickAction
          icon="bookmark-outline"
          title="Bookmarks"
          subtitle="Your saved pages"
          onPress={() => router.push('/bookmarks')}
        />
        <QuickAction
          icon="options-outline"
          title="Preferences"
          subtitle="Reading display"
          onPress={() => router.push('/settings')}
        />
      </View>

      <SectionHeading eyebrow="Daily verse" title={`${dailySurah?.englishName} ${dailyVerse.ayah}`} />
      <IslamicFrame light>
        <AppText tone="paper" style={styles.dailyArabic}>
          {dailyVerse.arabic}
        </AppText>
        <View style={styles.divider} />
        <AppText tone="paper" style={styles.dailyTranslation}>
          {dailyVerse.translation}
        </AppText>
        <AppText tone="paper" weight="bold" style={styles.reference}>
          {dailySurah?.englishName} · {dailyVerse.surah}:{dailyVerse.ayah}
        </AppText>
      </IslamicFrame>

      <SectionHeading eyebrow="Library" title="Explore the Quran" />
      <Pressable onPress={() => router.push('/quran')} style={styles.libraryCard}>
        <ArtworkPlaceholder icon="map-outline" />
        <View style={styles.libraryCopy}>
          <AppText weight="bold" style={styles.libraryTitle}>
            Surah & Juz index
          </AppText>
          <AppText tone="secondary">
            Search all 114 surahs or enter any of the 30 juz from its first page.
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={palette.gold} />
      </Pressable>
    </Screen>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={21} color={palette.goldLight} />
      </View>
      <AppText weight="bold">{title}</AppText>
      <AppText tone="secondary" style={styles.quickSubtitle}>
        {subtitle}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.7,
  },
  heading: {
    fontSize: 34,
    lineHeight: 42,
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.gold,
    backgroundColor: palette.emerald800,
  },
  continueCard: {
    minHeight: 190,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: palette.gold,
  },
  continueCopy: {
    flex: 1,
  },
  continueTitle: {
    marginTop: spacing.sm,
    fontSize: 26,
    lineHeight: 34,
  },
  progressTrack: {
    height: 4,
    marginTop: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  progressValue: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: palette.goldLight,
  },
  progressLabel: {
    marginTop: spacing.sm,
    fontSize: 11,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickCard: {
    width: '48%',
    minHeight: 142,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.25)',
  },
  quickIcon: {
    width: 40,
    height: 40,
    marginBottom: spacing.md,
    borderRadius: 20,
    backgroundColor: palette.emerald700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSubtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  dailyArabic: {
    fontFamily: 'AmiriQuran_400Regular',
    fontSize: 29,
    lineHeight: 52,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
    backgroundColor: palette.gold,
    opacity: 0.35,
  },
  dailyTranslation: {
    fontSize: 14,
    lineHeight: 23,
  },
  reference: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: palette.emerald700,
  },
  libraryCard: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.25)',
  },
  libraryCopy: {
    flex: 1,
  },
  libraryTitle: {
    marginBottom: spacing.xs,
    fontSize: 17,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
