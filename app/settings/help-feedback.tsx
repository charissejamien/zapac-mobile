import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FaqCard } from '@/components/help-feedback/faq-card';
import { FeedbackForm } from '@/components/help-feedback/feedback-form';
import { HELP_FEEDBACK_COLORS } from '@/components/help-feedback/help-feedback-theme';
import { SettingsSubpageHeader } from '@/components/settings/settings-subpage-header';

const FAQS = [
  {
    answer: 'Start by exploring the map, checking nearby routes, and saving the places you visit often.',
    icon: <MaterialCommunityIcons name="bus" size={20} color={HELP_FEEDBACK_COLORS.blue} />,
    title: 'Getting Started',
  },
  {
    answer: 'Use map filters to narrow down transport options and focus on the routes that match your trip.',
    icon: <Feather name="filter" size={20} color={HELP_FEEDBACK_COLORS.blue} />,
    title: 'Map Features and Filters',
  },
  {
    answer: 'Community insights help commuters share useful updates and discover better travel choices.',
    icon: <FontAwesome5 name="lightbulb" size={19} color={HELP_FEEDBACK_COLORS.blue} />,
    title: 'Community Insights',
  },
];

export default function HelpFeedbackScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(FAQS[0].title);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      Keyboard.dismiss();
    }, []),
  );

  const submitFeedback = () => {
    Alert.alert('Thank you!', 'Your feedback has been sent.');
    setRating(0);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <StatusBar style="light" />
      <SettingsSubpageHeader onBack={() => router.back()} title="Help & Feedback" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.intro}>
          <Text style={styles.introEyebrow}>NEED A HAND?</Text>
          <Text style={styles.introTitle}>Frequently Asked Questions</Text>
          <Text style={styles.introDescription}>Tap a topic to find a quick answer.</Text>
        </View>

        <View style={styles.faqs}>
          {FAQS.map(faq => (
            <FaqCard
              answer={faq.answer}
              expanded={expandedFaq === faq.title}
              icon={faq.icon}
              key={faq.title}
              onPress={() => setExpandedFaq(current => current === faq.title ? null : faq.title)}
              title={faq.title}
            />
          ))}
        </View>

        <FeedbackForm
          message={message}
          onChangeMessage={setMessage}
          onChangeRating={setRating}
          onSubmit={submitFeedback}
          rating={rating}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: HELP_FEEDBACK_COLORS.background,
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  intro: {
    paddingHorizontal: 3,
    paddingVertical: 8,
  },
  introEyebrow: {
    color: HELP_FEEDBACK_COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.55,
  },
  introTitle: {
    marginTop: 5,
    color: HELP_FEEDBACK_COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },
  introDescription: {
    marginTop: 4,
    color: HELP_FEEDBACK_COLORS.mutedText,
    fontSize: 13,
  },
  faqs: {
    marginTop: 11,
    marginBottom: 17,
  },
});
