import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { palette, radius, spacing } from '@/constants/design';

type IslamicFrameProps = PropsWithChildren<{
  style?: ViewStyle;
  light?: boolean;
}>;

export function IslamicFrame({ children, style, light = false }: IslamicFrameProps) {
  const borderColor = light ? palette.emerald700 : palette.gold;
  return (
    <View
      style={[
        styles.frame,
        { borderColor, backgroundColor: light ? palette.ivory : palette.emerald800 },
        style,
      ]}>
      <View style={[styles.innerBorder, { borderColor }]} />
      <Corner style={styles.topLeft} color={borderColor} />
      <Corner style={styles.topRight} color={borderColor} />
      <Corner style={styles.bottomLeft} color={borderColor} />
      <Corner style={styles.bottomRight} color={borderColor} />
      {children}
    </View>
  );
}

function Corner({ style, color }: { style: ViewStyle; color: string }) {
  return <View style={[styles.corner, style, { borderColor: color }]} />;
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  innerBorder: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 6,
    borderWidth: 1,
    borderRadius: radius.lg - 5,
    opacity: 0.35,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
  },
  topLeft: {
    top: -12,
    left: -12,
  },
  topRight: {
    top: -12,
    right: -12,
  },
  bottomLeft: {
    bottom: -12,
    left: -12,
  },
  bottomRight: {
    right: -12,
    bottom: -12,
  },
});
