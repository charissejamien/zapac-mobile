import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { HELP_FEEDBACK_COLORS } from './help-feedback-theme';
import { useAppTheme } from '@/src/theme/app-theme';

const RATING_FEEDBACK = [
  '',
  'Thanks for being honest. We can do better.',
  'We hear you. There is room to improve.',
  'Nice! We are heading in the right direction.',
  'Lovely. Thanks for cheering us on!',
  'Amazing! You made our day.',
];

const STAR_COLORS = ['#F09B8B', '#F2AF72', '#E6BD55', '#91B86B', '#68B4A7'];

type FeedbackFormProps = {
  message: string;
  onChangeMessage: (value: string) => void;
  onChangeRating: (value: number) => void;
  onSubmit: () => void;
  rating: number;
};

export function FeedbackForm({
  message,
  onChangeMessage,
  onChangeRating,
  onSubmit,
  rating,
}: FeedbackFormProps) {
  const { colors } = useAppTheme();
  const canSubmit = Boolean(message.trim() && rating);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={styles.eyebrow}>SHARE YOUR THOUGHTS</Text>
      <Text style={[styles.title, { color: colors.text }]}>How can we make your commute better?</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>Your ideas help shape the next version of ZAPAC.</Text>

      <View style={styles.stars}>
        {STAR_COLORS.map((color, index) => {
          const star = index + 1;
          const selected = star <= rating;

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={star}
              onPress={() => onChangeRating(star)}
              style={[
                styles.starButton,
                { backgroundColor: colors.input, borderColor: colors.border },
                selected && styles.selectedStarButton,
                selected && { backgroundColor: `${color}1F`, borderColor: `${color}66` },
              ]}
            >
              <Feather
                name="star"
                size={25}
                color={selected ? color : '#C5CBD1'}
                fill={selected ? color : 'transparent'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.ratingFeedback, !rating && styles.ratingHint]}>
        {rating ? RATING_FEEDBACK[rating] : 'Tap a star to rate your experience'}
      </Text>

      <TextInput
        autoFocus={false}
        maxLength={500}
        multiline
        onChangeText={onChangeMessage}
        placeholder="Tell us what would make your trips easier..."
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
        textAlignVertical="top"
        value={message}
      />
      <Text style={styles.characterCount}>{message.length}/500</Text>

      <TouchableOpacity
        activeOpacity={canSubmit ? 0.8 : 1}
        disabled={!canSubmit}
        onPress={onSubmit}
        style={[styles.submitButton, !canSubmit && styles.disabledSubmitButton]}
      >
        <Feather name="send" size={16} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>Send Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  eyebrow: {
    color: HELP_FEEDBACK_COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.55,
  },
  title: {
    marginTop: 7,
    color: HELP_FEEDBACK_COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  description: {
    marginTop: 4,
    color: HELP_FEEDBACK_COLORS.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  stars: {
    marginTop: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starButton: {
    width: 43,
    height: 43,
    borderWidth: 1,
    borderColor: '#E5E9ED',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFCFD',
  },
  selectedStarButton: {
    transform: [{ translateY: -3 }],
  },
  ratingFeedback: {
    minHeight: 18,
    marginTop: 9,
    marginBottom: 15,
    color: HELP_FEEDBACK_COLORS.green,
    fontSize: 12,
    fontWeight: '700',
  },
  ratingHint: {
    color: '#A5ACB4',
    fontWeight: '500',
  },
  input: {
    minHeight: 118,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDE3E8',
    borderRadius: 12,
    color: HELP_FEEDBACK_COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#FCFDFE',
  },
  characterCount: {
    marginTop: 5,
    color: '#ABB2BA',
    fontSize: 11,
    textAlign: 'right',
  },
  submitButton: {
    height: 48,
    marginTop: 11,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: HELP_FEEDBACK_COLORS.green,
  },
  disabledSubmitButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
