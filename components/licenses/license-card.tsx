import { Feather } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LICENSE_COLORS } from './license-theme';
import { useAppTheme } from '@/src/theme/app-theme';

type LicenseCardProps = {
  license: string;
  name: string;
  repository: string;
  version: string;
};

export function LicenseCard({ license, name, repository, version }: LicenseCardProps) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => Linking.openURL(repository)}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
        <Feather name="package" size={17} color={LICENSE_COLORS.blue} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.details, { color: colors.textMuted }]}>v{version}  |  {license} License</Text>
      </View>
      <Feather name="external-link" size={16} color="#9BA2AA" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 61,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  iconBox: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FB',
  },
  content: {
    flex: 1,
  },
  name: {
    color: LICENSE_COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  details: {
    marginTop: 3,
    color: LICENSE_COLORS.mutedText,
    fontSize: 12,
  },
});
