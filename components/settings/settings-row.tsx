import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { SETTINGS_COLORS } from './settings-theme';
import { useAppTheme } from '@/src/theme/app-theme';

type SettingsRowProps = {
  destructive?: boolean;
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  showChevron?: boolean;
  value?: boolean;
};

export function SettingsRow({
  destructive = false,
  icon,
  label,
  onPress,
  onToggle,
  showChevron = true,
  value,
}: SettingsRowProps) {
  const { colors } = useAppTheme();
  const isToggle = typeof value === 'boolean' && onToggle;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.surface }]}
    >
      <View style={styles.rowStart}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: colors.primarySoft },
            destructive && styles.destructiveIconBox,
            destructive && { backgroundColor: colors.dangerSoft },
          ]}
        >
          {icon}
        </View>
        <Text style={[styles.label, { color: colors.text }, destructive && styles.destructiveLabel]}>
          {label}
        </Text>
      </View>

      {isToggle ? (
        <View style={styles.switchContainer}>
          <Switch
            ios_backgroundColor="#E3E5E8"
            onValueChange={onToggle}
            style={styles.switch}
            trackColor={{ false: '#E3E5E8', true: '#8EADD2' }}
            thumbColor="#FFFFFF"
            value={value}
          />
        </View>
      ) : showChevron ? (
        <Feather name="chevron-right" size={19} color="#989898" />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 54,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SETTINGS_COLORS.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SETTINGS_COLORS.iconBackground,
  },
  destructiveIconBox: {
    backgroundColor: '#FFF0F1',
  },
  label: {
    color: SETTINGS_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  destructiveLabel: {
    color: SETTINGS_COLORS.red,
  },
  switchContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }],
  },
});
