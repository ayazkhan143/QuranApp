import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { palette } from '@/constants/design';
import { useReader } from '@/context/reader-context';

type AppTextProps = PropsWithChildren<
  TextProps & {
    tone?: 'primary' | 'secondary' | 'gold' | 'paper';
    weight?: 'regular' | 'medium' | 'bold';
  }
>;

export function AppText({
  children,
  style,
  tone = 'primary',
  weight = 'regular',
  ...props
}: AppTextProps) {
  const { theme } = useReader();
  const color = {
    primary: theme === 'dark' ? palette.white : palette.ink,
    secondary: theme === 'dark' ? palette.muted : palette.emerald700,
    gold: palette.goldLight,
    paper: palette.ink,
  }[tone];

  return (
    <Text
      {...props}
      style={[
        styles.base,
        { color, fontWeight: weight === 'bold' ? '700' : weight === 'medium' ? '600' : '400' },
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 15,
    lineHeight: 22,
  },
});
