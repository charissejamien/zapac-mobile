import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PrivacyPolicySection } from '@/components/privacy/privacy-policy-section';
import { PrivacyText } from '@/components/privacy/privacy-text';
import { PRIVACY_COLORS } from '@/components/privacy/privacy-theme';
import { SettingsSubpageHeader } from '@/components/settings/settings-subpage-header';
import { useAppTheme } from '@/src/theme/app-theme';

const SUPPORT_EMAIL = 'zapac.developers@gmail.com';

export default function PrivacyPolicyScreen() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SettingsSubpageHeader onBack={() => router.back()} title="Privacy Policy" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.introCard, { backgroundColor: colors.primarySoft }]}>
          <View style={styles.iconBadge}>
            <Feather name="shield" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.eyebrow}>YOUR DATA, TREATED WITH CARE</Text>
          <Text style={[styles.title, { color: colors.text }]}>ZAPAC Privacy Policy</Text>
          <Text style={[styles.updated, { color: colors.textMuted }]}>Last updated: June 2, 2026</Text>
          <Text style={[styles.intro, { color: colors.text }]}>
            This policy explains how ZAPAC handles personal data when you use the app. We aim to
            follow the principles of transparency, legitimate purpose, and proportionality under
            the Philippine Data Privacy Act of 2012.
          </Text>
        </View>

        <PrivacyPolicySection title="1. Information We May Collect">
          <PrivacyText bullet>Account details, such as your name and email address.</PrivacyText>
          <PrivacyText bullet>
            Profile details you choose to provide, such as gender and date of birth.
          </PrivacyText>
          <PrivacyText bullet>
            Location data, when you enable a feature that needs your location and grant permission.
          </PrivacyText>
          <PrivacyText bullet>
            Saved places, route preferences, notification settings, and feedback you submit.
          </PrivacyText>
          <PrivacyText bullet>
            Limited device or usage information if needed to maintain, secure, and improve the app.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="2. How We Use Information">
          <PrivacyText bullet>Provide navigation, route, fare-estimate, and commuter features.</PrivacyText>
          <PrivacyText bullet>Personalize your experience and save your chosen preferences.</PrivacyText>
          <PrivacyText bullet>Respond to questions, support requests, and feedback.</PrivacyText>
          <PrivacyText bullet>Protect the app, troubleshoot issues, and improve reliability.</PrivacyText>
          <PrivacyText bullet>Meet legal obligations when applicable.</PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="3. Location Data">
          <PrivacyText>
            ZAPAC should request location access only when a location-based feature needs it. You
            can deny or revoke access through your device settings. Some map or route features may
            not work correctly without location access.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="4. Sharing and Service Providers">
          <PrivacyText>
            We do not sell your personal data. We may share only the data needed by trusted service
            providers that help operate the app, such as hosting, authentication, maps, or support
            tools. We may also disclose information when required by law or when necessary to
            protect users and the service.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="5. Retention and Security">
          <PrivacyText>
            We keep personal data only for as long as reasonably necessary for the purposes
            described in this policy or as required by law. We use reasonable organizational and
            technical safeguards, but no online service can promise absolute security.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="6. Your Privacy Rights">
          <PrivacyText>
            Subject to applicable law, you may ask to access, correct, object to processing,
            request deletion or blocking, or obtain a portable copy of your personal data. You may
            also withdraw consent where processing relies on consent and file a complaint with the
            National Privacy Commission.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="7. Children's Privacy">
          <PrivacyText>
            ZAPAC is not intended to collect personal data from children without appropriate
            consent from a parent or legal guardian. Please contact us if you believe a child has
            provided personal data without the required consent.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="8. Changes to This Policy">
          <PrivacyText>
            We may update this policy when the app changes or when required by law. We will revise
            the last-updated date and provide an appropriate notice for material changes.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="9. Contact Us">
          <PrivacyText>
            For privacy questions or requests, contact the ZAPAC development team:
          </PrivacyText>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            style={[styles.emailButton, { backgroundColor: colors.primarySoft }]}
          >
            <Feather name="mail" size={16} color={PRIVACY_COLORS.blue} />
            <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
        </PrivacyPolicySection>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PRIVACY_COLORS.background,
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  introCard: {
    marginBottom: 13,
    padding: 17,
    borderRadius: 17,
    backgroundColor: '#EEF5FD',
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIVACY_COLORS.blue,
  },
  eyebrow: {
    marginTop: 13,
    color: PRIVACY_COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.55,
  },
  title: {
    marginTop: 5,
    color: '#36404A',
    fontSize: 22,
    fontWeight: '800',
  },
  updated: {
    marginTop: 5,
    color: '#84909B',
    fontSize: 11,
  },
  intro: {
    marginTop: 11,
    color: PRIVACY_COLORS.text,
    fontSize: 13,
    lineHeight: 20,
  },
  emailButton: {
    minHeight: 39,
    paddingHorizontal: 11,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF5FD',
  },
  email: {
    color: PRIVACY_COLORS.blue,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 8,
    color: '#A0A8B0',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
