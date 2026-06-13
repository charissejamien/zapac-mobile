import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ABOUT_COLORS } from './about-theme';

type LegalRowProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
};

export function LegalRow({ icon, label, onPress }: LegalRowProps) {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.row}>
      <View style={styles.rowStart}>
        <View style={styles.iconBox}>
          <Feather name={icon} size={17} color={ABOUT_COLORS.blue} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={19} color="#9BA2AA" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 54,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ABOUT_COLORS.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  iconBox: {
    width: 31,
    height: 31,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FB',
  },
  label: {
    color: ABOUT_COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
