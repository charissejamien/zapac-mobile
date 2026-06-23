import { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';

import { PRIVACY_COLORS } from './privacy-theme';
import { useAppTheme } from '@/src/theme/app-theme';

type PrivacyTextProps = PropsWithChildren<{
  bullet?: boolean;
}>;

export function PrivacyText({ bullet = false, children }: PrivacyTextProps) {
  const { colors } = useAppTheme();
  return (
    <Text style={[styles.text, { color: colors.text }]}>
      {bullet ? '\u2022 ' : ''}
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: PRIVACY_COLORS.text,
    fontSize: 13,
    lineHeight: 20,
  },
});
