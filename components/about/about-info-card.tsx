import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ABOUT_COLORS } from './about-theme';
import { useAppTheme } from '@/src/theme/app-theme';

export function AboutInfoCard() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.item}>
        <View style={[styles.iconBox, styles.versionIcon]}>
          <Feather name="code" size={18} color={ABOUT_COLORS.green} />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Version</Text>
          <Text style={[styles.value, { color: colors.textMuted }]}>1.0.0 (Build 42)</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.item}>
        <View style={[styles.iconBox, styles.regionIcon]}>
          <MaterialCommunityIcons name="city-variant-outline" size={20} color={ABOUT_COLORS.blue} />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Home Base</Text>
          <Text style={[styles.value, { color: colors.textMuted }]}>Cebu, Philippines</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: ABOUT_COLORS.card,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  item: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionIcon: {
    backgroundColor: '#EDF8F5',
  },
  regionIcon: {
    backgroundColor: '#EEF4FB',
  },
  label: {
    color: ABOUT_COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    marginTop: 3,
    color: ABOUT_COLORS.mutedText,
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 10,
    backgroundColor: '#EEF0F2',
  },
});
