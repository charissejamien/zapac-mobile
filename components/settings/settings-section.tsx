import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SettingsSectionProps = PropsWithChildren<{
  darkMode?: boolean;
  title: string;
}>;

export function SettingsSection({ children, darkMode = false, title }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.title, darkMode && styles.darkTitle]}>{title}</Text>
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
  darkTitle: {
    color: '#AAB8C9',
  },
});
