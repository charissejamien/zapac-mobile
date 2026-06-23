import { ReactNode } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { NOTIFICATION_COLORS } from './notification-theme';
import { useAppTheme } from '@/src/theme/app-theme';

type NotificationToggleRowProps = {
  description?: string;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onToggle: (value: boolean) => void;
  value: boolean;
};

export function NotificationToggleRow({
  description,
  disabled = false,
  icon,
  label,
  onToggle,
  value,
}: NotificationToggleRowProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface }, disabled && styles.disabledRow]}>
      <View style={styles.rowStart}>
        <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>{icon}</View>
        <View style={styles.textBlock}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {description ? <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text> : null}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Switch
          disabled={disabled}
          ios_backgroundColor="#D8DEDF"
          onValueChange={onToggle}
          style={styles.switch}
          trackColor={{ false: '#D8DEDF', true: NOTIFICATION_COLORS.greenTrack }}
          thumbColor={value ? NOTIFICATION_COLORS.green : '#FFFFFF'}
          value={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    marginBottom: 9,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NOTIFICATION_COLORS.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  disabledRow: {
    opacity: 0.5,
  },
  rowStart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NOTIFICATION_COLORS.iconBackground,
  },
  textBlock: {
    flex: 1,
    paddingRight: 8,
  },
  label: {
    color: NOTIFICATION_COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  description: {
    marginTop: 2,
    color: NOTIFICATION_COLORS.mutedText,
    fontSize: 12,
    lineHeight: 16,
  },
  switchContainer: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }],
  },
});
