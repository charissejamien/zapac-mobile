import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AboutHero } from '@/components/about/about-hero';
import { AboutInfoCard } from '@/components/about/about-info-card';
import { ABOUT_COLORS } from '@/components/about/about-theme';
import { LegalRow } from '@/components/about/legal-row';
import { SettingsSubpageHeader } from '@/components/settings/settings-subpage-header';

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SettingsSubpageHeader onBack={() => router.back()} title="About ZAPAC" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AboutHero />

        <Text style={styles.sectionTitle}>APP DETAILS</Text>
        <AboutInfoCard />

        <Text style={styles.sectionTitle}>LEGAL INFORMATION</Text>
        <LegalRow
          icon="shield"
          label="Privacy Policy"
          onPress={() => router.push('/settings/privacy-policy')}
        />
        <LegalRow
          icon="file-text"
          label="Terms of Service"
          onPress={() => router.push('/settings/terms-of-service')}
        />
        <LegalRow
          icon="book-open"
          label="Licenses"
          onPress={() => router.push('/settings/licenses')}
        />

        <Text style={styles.footer}>Made with care for Cebu commuters.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ABOUT_COLORS.background,
  },
  content: {
    padding: 14,
    paddingBottom: 26,
  },
  sectionTitle: {
    marginBottom: 9,
    marginLeft: 2,
    marginTop: 20,
    color: '#767F88',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.55,
  },
  footer: {
    marginTop: 17,
    color: '#A4ABB2',
    fontSize: 11,
    textAlign: 'center',
  },
});
