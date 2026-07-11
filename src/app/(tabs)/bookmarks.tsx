import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ArtworkPlaceholder } from '@/components/artwork-placeholder';
import { Screen } from '@/components/screen';
import { palette, radius, spacing } from '@/constants/design';
import { useReader } from '@/context/reader-context';
import { getPage, surahByNumber } from '@/data';

export default function BookmarksScreen() {
  const { bookmarks, toggleBookmark } = useReader();

  return (
    <Screen>
      <AppText tone="gold" weight="bold" style={styles.overline}>
        SAVED READING
      </AppText>
      <AppText weight="bold" style={styles.heading}>
        Bookmarks
      </AppText>
      <AppText tone="secondary">Return to the pages you want to revisit.</AppText>

      {bookmarks.length === 0 ? (
        <View style={styles.empty}>
          <ArtworkPlaceholder icon="bookmark-outline" />
          <AppText weight="bold" style={styles.emptyTitle}>
            No saved pages yet
          </AppText>
          <AppText tone="secondary" style={styles.emptyCopy}>
            Tap the bookmark icon in the reader to save a Mushaf page here.
          </AppText>
          <Pressable onPress={() => router.push('/quran')} style={styles.primaryButton}>
            <AppText tone="paper" weight="bold">
              Browse the Quran
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {bookmarks.map((pageNumber) => {
            const page = getPage(pageNumber);
            const firstVerse = page.verses[0];
            const surah = surahByNumber.get(firstVerse.surah);
            return (
              <Pressable
                key={pageNumber}
                onPress={() =>
                  router.push({ pathname: '/reader', params: { page: String(pageNumber) } })
                }
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
                <View style={styles.pageBadge}>
                  <AppText tone="gold" weight="bold" style={styles.pageNumber}>
                    {pageNumber}
                  </AppText>
                  <AppText tone="secondary" style={styles.pageLabel}>
                    PAGE
                  </AppText>
                </View>
                <View style={styles.cardCopy}>
                  <AppText weight="bold" style={styles.cardTitle}>
                    {surah?.englishName}
                  </AppText>
                  <AppText tone="secondary" style={styles.preview} numberOfLines={2}>
                    {firstVerse.translation}
                  </AppText>
                </View>
                <Pressable onPress={() => toggleBookmark(pageNumber)} hitSlop={12}>
                  <Ionicons name="bookmark" size={22} color={palette.goldLight} />
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  overline: {
    marginTop: spacing.sm,
    fontSize: 10,
    letterSpacing: 1.7,
  },
  heading: {
    marginTop: spacing.xs,
    fontSize: 30,
    lineHeight: 38,
  },
  empty: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.xl,
    fontSize: 20,
  },
  emptyCopy: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: palette.goldLight,
  },
  list: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.25)',
  },
  pageBadge: {
    width: 54,
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 22,
    lineHeight: 28,
  },
  pageLabel: {
    fontSize: 9,
    letterSpacing: 1.2,
  },
  cardCopy: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
  },
  preview: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
