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

export default function TermsOfServiceScreen() {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <SettingsSubpageHeader onBack={() => router.back()} title="Terms of Service" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.introCard, { backgroundColor: colors.primarySoft }]}>
          <View style={styles.iconBadge}>
            <Feather name="file-text" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.eyebrow}>LET&apos;S TRAVEL RESPONSIBLY</Text>
          <Text style={[styles.title, { color: colors.text }]}>ZAPAC Terms of Service</Text>
          <Text style={[styles.updated, { color: colors.textMuted }]}>Last updated: June 2, 2026</Text>
          <Text style={[styles.intro, { color: colors.text }]}>
            These Terms of Service govern your use of ZAPAC. By creating an account or using the
            app, you agree to these terms. If you do not agree, please do not use ZAPAC.
          </Text>
        </View>

        <PrivacyPolicySection title="1. What ZAPAC Provides">
          <PrivacyText>
            ZAPAC is a commuter-information platform designed to help users explore transportation
            options in Cebu. Features may include route guidance, fare estimates, saved places,
            notifications, and community-driven insights.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="2. Accounts and Eligibility">
          <PrivacyText bullet>Provide accurate information when creating or updating your account.</PrivacyText>
          <PrivacyText bullet>Keep your login details private and use reasonable care to secure your account.</PrivacyText>
          <PrivacyText bullet>Notify us promptly if you believe your account has been accessed without permission.</PrivacyText>
          <PrivacyText bullet>
            If you are under the age required to consent under applicable law, use ZAPAC only with
            the involvement of a parent or legal guardian.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="3. Route and Fare Information">
          <PrivacyText>
            Routes, travel times, availability, and fare estimates may change due to traffic,
            weather, operator decisions, road conditions, community reports, or other factors.
            ZAPAC provides helpful guidance, but does not guarantee that every detail is complete,
            current, or error-free.
          </PrivacyText>
          <PrivacyText>
            Use your judgment, follow local rules, confirm important trip details when needed, and
            prioritize your personal safety while commuting.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="4. Acceptable Use">
          <PrivacyText bullet>Use ZAPAC only for lawful purposes.</PrivacyText>
          <PrivacyText bullet>Do not submit false, misleading, harmful, or abusive information.</PrivacyText>
          <PrivacyText bullet>Do not attempt to disrupt, damage, reverse engineer, or gain unauthorized access to the app.</PrivacyText>
          <PrivacyText bullet>Do not use ZAPAC to violate another person&apos;s privacy or rights.</PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="5. Community Contributions">
          <PrivacyText>
            If you submit feedback, route reports, or other contributions, you are responsible for
            their accuracy and legality. You give ZAPAC permission to use, review, display, and
            adapt those contributions as reasonably needed to operate and improve the service.
          </PrivacyText>
          <PrivacyText>
            We may remove contributions that are inaccurate, unsafe, unlawful, or inconsistent
            with these terms.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="6. Privacy">
          <PrivacyText>
            Our Privacy Policy explains how we handle personal data. Please review it from the
            About ZAPAC screen before using the app.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="7. Availability and Changes">
          <PrivacyText>
            We may update, suspend, or discontinue features as the app evolves. We may also release
            fixes, improvements, or new versions. We will aim to communicate material changes when
            appropriate.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="8. Third-Party Services">
          <PrivacyText>
            ZAPAC may rely on third-party services such as authentication, hosting, maps, or links.
            Those services may have their own terms and policies. We are not responsible for
            third-party services that we do not control.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="9. Disclaimer and Limitation of Liability">
          <PrivacyText>
            ZAPAC is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the
            extent permitted by law. We do not promise uninterrupted access or perfect accuracy.
          </PrivacyText>
          <PrivacyText>
            To the extent permitted by applicable law, ZAPAC and its developers will not be liable
            for indirect, incidental, or consequential losses arising from your use of the app.
            Nothing in these terms limits rights or liabilities that cannot legally be limited.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="10. Suspension or Termination">
          <PrivacyText>
            You may stop using ZAPAC at any time. We may suspend or terminate access when reasonably
            necessary to protect users, maintain the service, comply with law, or respond to a
            material violation of these terms.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="11. Governing Law">
          <PrivacyText>
            These terms are governed by the laws of the Republic of the Philippines, without
            prejudice to any consumer rights or protections that apply to you.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="12. Changes to These Terms">
          <PrivacyText>
            We may update these terms as ZAPAC evolves. We will revise the last-updated date and
            provide an appropriate notice for material changes. Continuing to use the app after an
            update means you accept the revised terms.
          </PrivacyText>
        </PrivacyPolicySection>

        <PrivacyPolicySection title="13. Contact Us">
          <PrivacyText>For questions about these terms, contact the ZAPAC development team:</PrivacyText>
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
