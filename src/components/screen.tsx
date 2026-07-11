import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing } from '@/constants/design';
import { useReader } from '@/context/reader-context';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
}>;

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const { theme } = useReader();
  const colors: readonly [string, string] =
    theme === 'dark'
      ? [palette.emerald950, palette.emerald900]
      : [palette.ivory, palette.emerald100];

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
  );

  return (
    <LinearGradient colors={colors} style={styles.fill}>
      <SafeAreaView style={styles.fill} edges={['top', 'left', 'right']}>
        {content}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
});
