import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { palette, spacing } from '@/constants/design';

export function SectionHeading({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <View style={styles.container}>
      <View>
        {eyebrow ? (
          <AppText tone="gold" weight="bold" style={styles.eyebrow}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText weight="bold" style={styles.title}>
          {title}
        </AppText>
      </View>
      <View style={styles.ornament}>
        <View style={styles.line} />
        <View style={styles.diamond} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
  },
  ornament: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  line: {
    width: 42,
    height: 1,
    backgroundColor: palette.gold,
    opacity: 0.6,
  },
  diamond: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: palette.gold,
    transform: [{ rotate: '45deg' }],
  },
});
