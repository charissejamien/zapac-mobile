import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PRIVACY_COLORS } from './privacy-theme';

type PrivacyPolicySectionProps = {
  children: ReactNode;
  title: string;
};

export function PrivacyPolicySection({ children, title }: PrivacyPolicySectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 13,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    color: PRIVACY_COLORS.blue,
    fontSize: 15,
    fontWeight: '800',
  },
  content: {
    marginTop: 8,
    gap: 7,
  },
});
