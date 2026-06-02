import { Feather } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HELP_FEEDBACK_COLORS } from './help-feedback-theme';

type FaqCardProps = {
  answer: string;
  expanded: boolean;
  icon: ReactNode;
  onPress: () => void;
  title: string;
};

export function FaqCard({ answer, expanded, icon, onPress, title }: FaqCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#7D8790" />
      </View>
      {expanded ? <Text style={styles.answer}>{answer}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 9,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HELP_FEEDBACK_COLORS.iconBackground,
  },
  title: {
    flex: 1,
    color: HELP_FEEDBACK_COLORS.blue,
    fontSize: 15,
    fontWeight: '700',
  },
  answer: {
    marginTop: 11,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: '#EDF0F3',
    color: HELP_FEEDBACK_COLORS.mutedText,
    fontSize: 13,
    lineHeight: 19,
  },
});
