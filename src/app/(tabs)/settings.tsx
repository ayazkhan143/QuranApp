import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Screen } from '@/components/screen';
import { palette, radius, spacing } from '@/constants/design';
import { useReader } from '@/context/reader-context';
import { quran } from '@/data';

export default function SettingsScreen() {
  const {
    showTranslation,
    toggleTranslation,
    arabicFontSize,
    setArabicFontSize,
    theme,
    setTheme,
  } = useReader();

  return (
    <Screen>
      <AppText tone="gold" weight="bold" style={styles.overline}>
        READING EXPERIENCE
      </AppText>
      <AppText weight="bold" style={styles.heading}>
        Preferences
      </AppText>
      <AppText tone="secondary">Make your reading space calm and comfortable.</AppText>

      <SettingsSection title="Reader">
        <SettingRow
          icon="language-outline"
          title="English translation"
          description="Pickthall translation below each ayah"
          control={
            <Switch
              value={showTranslation}
              onValueChange={toggleTranslation}
              trackColor={{ false: palette.emerald700, true: palette.gold }}
              thumbColor={palette.ivory}
            />
          }
        />
        <View style={styles.separator} />
        <SettingRow
          icon="text-outline"
          title="Arabic text size"
          description={`${arabicFontSize}px in the page reader`}
          control={
            <View style={styles.stepper}>
              <StepperButton
                icon="remove"
                onPress={() => setArabicFontSize(arabicFontSize - 2)}
                disabled={arabicFontSize <= 24}
              />
              <AppText weight="bold" style={styles.sizeValue}>
                {arabicFontSize}
              </AppText>
              <StepperButton
                icon="add"
                onPress={() => setArabicFontSize(arabicFontSize + 2)}
                disabled={arabicFontSize >= 44}
              />
            </View>
          }
        />
      </SettingsSection>

      <SettingsSection title="Appearance">
        <View style={styles.themeRow}>
          <ThemeButton
            label="Night"
            icon="moon-outline"
            active={theme === 'dark'}
            onPress={() => setTheme('dark')}
          />
          <ThemeButton
            label="Light"
            icon="sunny-outline"
            active={theme === 'light'}
            onPress={() => setTheme('light')}
          />
        </View>
      </SettingsSection>

      <SettingsSection title="Quran data">
        <SettingRow
          icon="shield-checkmark-outline"
          title="Complete offline text"
          description={`${quran.metadata.surahCount} surahs · ${quran.metadata.ayahCount.toLocaleString()} ayat · ${quran.metadata.pageCount} pages`}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="information-circle-outline"
          title="Arabic text attribution"
          description={`${quran.metadata.arabicTextAttribution} via ${quran.metadata.source}`}
        />
      </SettingsSection>
    </Screen>
  );
}

function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText tone="gold" weight="bold" style={styles.sectionTitle}>
        {title.toUpperCase()}
      </AppText>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  description,
  control,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  control?: ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={palette.goldLight} />
      </View>
      <View style={styles.settingCopy}>
        <AppText weight="bold">{title}</AppText>
        <AppText tone="secondary" style={styles.description}>
          {description}
        </AppText>
      </View>
      {control}
    </View>
  );
}

function StepperButton({
  icon,
  onPress,
  disabled,
}: {
  icon: 'add' | 'remove';
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.stepperButton, disabled && styles.disabled]}>
      <Ionicons name={icon} size={18} color={palette.goldLight} />
    </Pressable>
  );
}

function ThemeButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.themeButton, active && styles.themeActive]}>
      <Ionicons name={icon} size={22} color={active ? palette.goldLight : palette.muted} />
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
    letterSpacing: 1.7,
  },
  heading: {
    marginTop: spacing.xs,
    fontSize: 30,
    lineHeight: 38,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  sectionCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: palette.emerald800,
    borderWidth: 1,
    borderColor: 'rgba(215,181,109,0.22)',
  },
  settingRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.emerald700,
  },
  settingCopy: {
    flex: 1,
  },
  description: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
  },
  separator: {
    height: 1,
    marginVertical: spacing.md,
    backgroundColor: 'rgba(215,181,109,0.16)',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.emerald700,
  },
  sizeValue: {
    minWidth: 24,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.35,
  },
  themeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  themeButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: palette.emerald900,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeActive: {
    borderColor: palette.gold,
    backgroundColor: palette.emerald700,
  },
});
