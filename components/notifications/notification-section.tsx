import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/src/theme/app-theme';

type NotificationSectionProps = PropsWithChildren<{
  title: string;
}>;

export function NotificationSection({ children, title }: NotificationSectionProps) {
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
    marginBottom: 19,
  },
  title: {
    marginBottom: 9,
    marginLeft: 2,
    color: '#686868',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
});
