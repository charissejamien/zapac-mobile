import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LicenseCard } from '@/components/licenses/license-card';
import { LICENSE_COLORS } from '@/components/licenses/license-theme';
import { SettingsSubpageHeader } from '@/components/settings/settings-subpage-header';

const SUPPORT_EMAIL = 'zapac.developers@gmail.com';

const LICENSES = [
  { license: 'MIT', name: 'React', repository: 'https://github.com/facebook/react', version: '19.1.0' },
  { license: 'MIT', name: 'React Native', repository: 'https://github.com/facebook/react-native', version: '0.81.5' },
  { license: 'MIT', name: 'Expo', repository: 'https://github.com/expo/expo', version: '54.0.34' },
  { license: 'MIT', name: 'Expo Router', repository: 'https://github.com/expo/expo', version: '6.0.23' },
  { license: 'MIT', name: 'React Navigation', repository: 'https://github.com/react-navigation/react-navigation', version: '7.2.4' },
  { license: 'MIT', name: 'Supabase JS', repository: 'https://github.com/supabase/supabase-js', version: '2.105.4' },
  { license: 'MIT', name: 'NativeWind', repository: 'https://github.com/marklawlor/nativewind', version: '4.2.3' },
  { license: 'MIT', name: 'Tailwind CSS', repository: 'https://github.com/tailwindlabs/tailwindcss', version: '3.4.19' },
  { license: 'MIT', name: 'React Native Reanimated', repository: 'https://github.com/software-mansion/react-native-reanimated', version: '4.1.7' },
  { license: 'MIT', name: 'React Native Safe Area Context', repository: 'https://github.com/AppAndFlow/react-native-safe-area-context', version: '5.6.2' },
  { license: 'MIT', name: 'Expo Linear Gradient', repository: 'https://github.com/expo/expo', version: '15.0.8' },
];

export default function LicensesScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <SettingsSubpageHeader onBack={() => router.back()} title="Open-Source Licenses" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.introCard}>
          <View style={styles.iconBadge}>
            <Feather name="heart" size={21} color="#FFFFFF" />
          </View>
          <Text style={styles.eyebrow}>BUILT WITH GREAT TOOLS</Text>
          <Text style={styles.title}>Thank you, open source!</Text>
          <Text style={styles.intro}>
            ZAPAC is built with software generously shared by developer communities around the
            world. Tap a package to visit its repository.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>MAJOR PACKAGES</Text>
        {LICENSES.map(item => <LicenseCard key={item.name} {...item} />)}

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Open-source components remain subject to their respective license terms. This list
            highlights major packages and is not a substitute for a complete release audit.
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            style={styles.emailButton}
          >
            <Feather name="mail" size={15} color={LICENSE_COLORS.blue} />
            <Text style={styles.email}>{SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: LICENSE_COLORS.background,
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  introCard: {
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
    backgroundColor: LICENSE_COLORS.green,
  },
  eyebrow: {
    marginTop: 13,
    color: LICENSE_COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.55,
  },
  title: {
    marginTop: 5,
    color: LICENSE_COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },
  intro: {
    marginTop: 9,
    color: LICENSE_COLORS.mutedText,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    marginBottom: 9,
    marginLeft: 2,
    marginTop: 19,
    color: '#767F88',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.55,
  },
  notice: {
    marginTop: 8,
    padding: 14,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  noticeText: {
    color: LICENSE_COLORS.mutedText,
    fontSize: 12,
    lineHeight: 18,
  },
  emailButton: {
    minHeight: 38,
    marginTop: 11,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#EEF5FD',
  },
  email: {
    color: LICENSE_COLORS.blue,
    fontSize: 12,
    fontWeight: '700',
  },
});
