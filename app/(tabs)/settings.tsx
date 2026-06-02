import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { SettingsHeader } from '@/components/settings/settings-header';
import { SettingsRow } from '@/components/settings/settings-row';
import { SettingsSection } from '@/components/settings/settings-section';
import { SETTINGS_COLORS } from '@/components/settings/settings-theme';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, `${feature} will be available soon.`);
  };

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again to access your account.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <View style={[styles.screen, darkMode && styles.darkScreen]}>
      <StatusBar style="light" />
      {/* TODO: Replace with real data from auth. */}
      <SettingsHeader
        email="cess@gmail.com"
        name="GWAPA"
        onEditProfile={() => showComingSoon('Edit profile')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SettingsSection darkMode={darkMode} title="PREFERENCES">
          <SettingsRow
            darkMode={darkMode}
            icon={<Feather name="sun" size={18} color={SETTINGS_COLORS.icon} />}
            label="Dark Mode"
            onToggle={setDarkMode}
            showChevron={false}
            value={darkMode}
          />
          <SettingsRow
            darkMode={darkMode}
            icon={<Ionicons name="notifications" size={17} color={SETTINGS_COLORS.icon} />}
            label="Notifications"
            onPress={() => router.push('/(tabs)/notifications')}
          />
        </SettingsSection>

        <SettingsSection darkMode={darkMode} title="SUPPORT">
          <SettingsRow
            darkMode={darkMode}
            icon={<Feather name="help-circle" size={18} color={SETTINGS_COLORS.icon} />}
            label="Help & Feedback"
            onPress={() => router.push('/(tabs)/help-feedback')}
          />
          <SettingsRow
            darkMode={darkMode}
            icon={<Feather name="info" size={18} color={SETTINGS_COLORS.icon} />}
            label="About"
            onPress={() => showComingSoon('About')}
          />
        </SettingsSection>

        <SettingsSection darkMode={darkMode} title="ACCOUNT">
          <SettingsRow
            darkMode={darkMode}
            destructive
            icon={<MaterialCommunityIcons name="logout" size={18} color={SETTINGS_COLORS.red} />}
            label="Logout"
            onPress={confirmLogout}
          />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SETTINGS_COLORS.background,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 24,
  },
  darkScreen: {
    backgroundColor: SETTINGS_COLORS.darkBackground,
  },
});
