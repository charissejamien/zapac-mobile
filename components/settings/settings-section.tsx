import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/src/theme/app-theme';

type SettingsSectionProps = PropsWithChildren<{
  title: string;
}>;

export function SettingsSection({ children, title }: SettingsSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  title: {
    marginBottom: 8,
    marginLeft: 2,
    color: '#828282',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
});
