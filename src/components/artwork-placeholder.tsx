import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { palette, radius } from '@/constants/design';

export function ArtworkPlaceholder({ icon = 'sparkles-outline' }: { icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.container}>
      <View style={styles.arch} />
      <View style={styles.star}>
        <Ionicons name={icon} color={palette.goldLight} size={24} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 82,
    height: 82,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.emerald900,
    borderWidth: 1,
    borderColor: palette.gold,
  },
  arch: {
    position: 'absolute',
    top: 14,
    width: 50,
    height: 62,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: palette.emerald700,
  },
  star: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderColor: palette.gold,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
