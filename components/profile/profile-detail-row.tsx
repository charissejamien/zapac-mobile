import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PROFILE_COLORS } from './profile-theme';

type ProfileDetailRowProps = {
  icon: ReactNode;
  label: string;
  value?: string;
  destructive?: boolean;
  onPress?: () => void;
};

export function ProfileDetailRow({
  icon,
  label,
  value,
  destructive = false,
  onPress,
}: ProfileDetailRowProps) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.row}>
      <View style={styles.rowStart}>
        <View style={[styles.iconBox, destructive && styles.deleteIconBox]}>{icon}</View>
        <Text style={[styles.label, destructive && styles.deleteText]}>{label}</Text>
      </View>

      <View style={styles.rowEnd}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        <Feather name="chevron-right" size={18} color="#929292" />
      </View>
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#EEF3FB',
  },
  deleteIconBox: {
    backgroundColor: '#FFF0F1',
  },
  label: {
    color: PROFILE_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteText: {
    color: PROFILE_COLORS.red,
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '600',
  },
});
