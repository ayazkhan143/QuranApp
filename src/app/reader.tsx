import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { palette, radius, spacing } from '@/constants/design';
import { useReader } from '@/context/reader-context';
import { quran, surahByNumber } from '@/data';
import type { QuranPage } from '@/types/quran';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export default function ReaderScreen() {
  const params = useLocalSearchParams<{ page?: string }>();
  const requestedPage = Number.parseInt(params.page ?? '1', 10);
  const initialPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), quran.metadata.pageCount)
    : 1;
  const listRef = useRef<FlatList<QuranPage>>(null);
  const { width } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const {
    bookmarks,
    toggleBookmark,
    setLastPage,
    showTranslation,
    arabicFontSize,
  } = useReader();
  const isBookmarked = bookmarks.includes(currentPage);
  const page = quran.pages[currentPage - 1];
  const currentSurah = surahByNumber.get(page.verses[0].surah);

  function goToPage(pageNumber: number) {
    const nextPage = Math.min(Math.max(pageNumber, 1), quran.metadata.pageCount);
    listRef.current?.scrollToIndex({ index: nextPage - 1, animated: true });
    setCurrentPage(nextPage);
    setLastPage(nextPage);
  }

  function handleSwipe(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextPage = Math.min(
      Math.max(Math.round(event.nativeEvent.contentOffset.x / width) + 1, 1),
      quran.metadata.pageCount,
    );
    setCurrentPage(nextPage);
    setLastPage(nextPage);
  }

  function handleBookmark() {
    toggleBookmark(currentPage);
    Haptics.selectionAsync();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={palette.goldLight} />
        </Pressable>
        <View style={styles.headerCopy}>
          <AppText tone="gold" weight="bold" style={styles.headerTitle}>
            {currentSurah?.englishName}
          </AppText>
          <AppText tone="secondary" style={styles.headerMeta}>
            Page {currentPage} of 604 · Juz {page.verses[0].juz}
          </AppText>
        </View>
        <Pressable onPress={handleBookmark} style={styles.iconButton} hitSlop={10}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={21}
            color={palette.goldLight}
          />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={quran.pages}
        horizontal
        pagingEnabled
        initialScrollIndex={initialPage - 1}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.number)}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={handleSwipe}
        renderItem={({ item }) => (
          <MushafPage
            page={item}
            width={width}
            showTranslation={showTranslation}
            arabicFontSize={arabicFontSize}
          />
        )}
      />

      <View style={styles.pagination}>
        <Pressable
          disabled={currentPage === 1}
          onPress={() => goToPage(currentPage - 1)}
          style={[styles.pageButton, currentPage === 1 && styles.disabled]}>
          <Ionicons name="chevron-back" size={18} color={palette.goldLight} />
          <AppText tone="gold" weight="bold" style={styles.pageButtonLabel}>
            Previous
          </AppText>
        </Pressable>
        <View style={styles.pagePill}>
          <AppText tone="paper" weight="bold">
            {currentPage}
          </AppText>
        </View>
        <Pressable
          disabled={currentPage === quran.metadata.pageCount}
          onPress={() => goToPage(currentPage + 1)}
          style={[
            styles.pageButton,
            styles.nextButton,
            currentPage === quran.metadata.pageCount && styles.disabled,
          ]}>
          <AppText tone="gold" weight="bold" style={styles.pageButtonLabel}>
            Next
          </AppText>
          <Ionicons name="chevron-forward" size={18} color={palette.goldLight} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function MushafPage({
  page,
  width,
  showTranslation,
  arabicFontSize,
}: {
  page: QuranPage;
  width: number;
  showTranslation: boolean;
  arabicFontSize: number;
}) {
  return (
    <View style={[styles.pageViewport, { width }]}>
      <View style={styles.paper}>
        <View style={styles.paperBorder}>
          <ScrollView
            contentContainerStyle={styles.pageContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            <View style={styles.pageTopline}>
              <AppText tone="paper" style={styles.pageTopMeta}>
                Juz {page.verses[0].juz}
              </AppText>
              <View style={styles.topOrnament} />
              <AppText tone="paper" style={styles.pageTopMeta}>
                {page.number}
              </AppText>
            </View>

            {page.verses.map((verse) => {
              const surah = surahByNumber.get(verse.surah);
              return (
                <View key={verse.number}>
                  {verse.ayah === 1 ? (
                    <View style={styles.surahHeader}>
                      <View style={styles.surahLine} />
                      <AppText tone="paper" weight="bold" style={styles.surahEnglish}>
                        {surah?.englishName}
                      </AppText>
                      <AppText tone="paper" style={styles.surahArabic}>
                        {surah?.name}
                      </AppText>
                      {verse.surah !== 1 && verse.surah !== 9 ? (
                        <AppText tone="paper" style={styles.bismillah}>
                          {BISMILLAH}
                        </AppText>
                      ) : null}
                    </View>
                  ) : null}

                  <View style={styles.verse}>
                    <AppText
                      tone="paper"
                      style={[
                        styles.arabic,
                        { fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.9 },
                      ]}>
                      {verse.arabic}{' '}
                      <AppText tone="paper" style={[styles.ayahNumber, { fontSize: arabicFontSize * 0.68 }]}>
                        ﴿{verse.ayah}﴾
                      </AppText>
                    </AppText>
                    {showTranslation ? (
                      <AppText tone="paper" style={styles.translation}>
                        {verse.translation}
                      </AppText>
                    ) : null}
                  </View>
                </View>
              );
            })}

            <View style={styles.pageFooter}>
              <View style={styles.footerDiamond} />
              <AppText tone="paper" weight="bold" style={styles.footerPage}>
                {page.number}
              </AppText>
              <View style={styles.footerDiamond} />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.emerald950,
  },
  header: {
    height: 66,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.emerald800,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.35)',
    backgroundColor: palette.emerald800,
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  headerMeta: {
    fontSize: 10,
    lineHeight: 14,
  },
  pageViewport: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  paper: {
    flex: 1,
    width: '100%',
    maxWidth: 760,
    borderRadius: radius.md,
    padding: 6,
    backgroundColor: palette.paper,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  paperBorder: {
    flex: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.gold,
    overflow: 'hidden',
  },
  pageContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  pageTopline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  pageTopMeta: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  topOrnament: {
    width: 34,
    height: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.gold,
  },
  surahHeader: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  surahLine: {
    width: '100%',
    height: 38,
    position: 'absolute',
    top: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.gold,
    backgroundColor: 'rgba(215,181,109,0.08)',
  },
  surahEnglish: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  surahArabic: {
    marginTop: spacing.md,
    fontFamily: 'AmiriQuran_400Regular',
    fontSize: 26,
    lineHeight: 40,
    textAlign: 'center',
  },
  bismillah: {
    marginTop: spacing.sm,
    fontFamily: 'AmiriQuran_400Regular',
    fontSize: 23,
    lineHeight: 42,
    textAlign: 'center',
  },
  verse: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(21,35,31,0.18)',
  },
  arabic: {
    fontFamily: 'AmiriQuran_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ayahNumber: {
    color: palette.emerald700,
  },
  translation: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 21,
    color: '#3D4B46',
  },
  pageFooter: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  footerDiamond: {
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: palette.gold,
    transform: [{ rotate: '45deg' }],
  },
  footerPage: {
    fontSize: 11,
  },
  pagination: {
    height: 70,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: palette.emerald800,
  },
  pageButton: {
    minWidth: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nextButton: {
    justifyContent: 'flex-end',
  },
  pageButtonLabel: {
    fontSize: 12,
  },
  pagePill: {
    minWidth: 54,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.goldLight,
  },
  disabled: {
    opacity: 0.3,
  },
});
