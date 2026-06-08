import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { NotificationHeader } from '@/components/notifications/notification-header';
import { NotificationSection } from '@/components/notifications/notification-section';
import { NOTIFICATION_COLORS } from '@/components/notifications/notification-theme';
import { NotificationToggleRow } from '@/components/notifications/notification-toggle-row';

export default function NotificationsScreen() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [floatingNotifications, setFloatingNotifications] = useState(true);
  const [lockScreenNotifications, setLockScreenNotifications] = useState(true);
  const [allowSound, setAllowSound] = useState(true);
  const [allowVibration, setAllowVibration] = useState(true);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <NotificationHeader onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <NotificationSection title="GENERAL">
          <NotificationToggleRow
            icon={<Ionicons name="notifications" size={22} color={NOTIFICATION_COLORS.icon} />}
            label="Show notifications"
            onToggle={setShowNotifications}
            value={showNotifications}
          />
        </NotificationSection>

        <NotificationSection title="BEHAVIOR">
          <NotificationToggleRow
            disabled={!showNotifications}
            icon={<MaterialCommunityIcons name="badge-account" size={22} color={NOTIFICATION_COLORS.icon} />}
            label="Show app icon badges"
            onToggle={setShowBadges}
            value={showBadges}
          />
          <NotificationToggleRow
            description="Allow floating notifications"
            disabled={!showNotifications}
            icon={<MaterialCommunityIcons name="card-outline" size={22} color={NOTIFICATION_COLORS.icon} />}
            label="Floating notifications"
            onToggle={setFloatingNotifications}
            value={floatingNotifications}
          />
          <NotificationToggleRow
            description="Allow notifications on the Lock screen"
            disabled={!showNotifications}
            icon={<Feather name="lock" size={20} color={NOTIFICATION_COLORS.icon} />}
            label="Lock screen notifications"
            onToggle={setLockScreenNotifications}
            value={lockScreenNotifications}
          />
        </NotificationSection>

        <NotificationSection title="ALERTS">
          <NotificationToggleRow
            disabled={!showNotifications}
            icon={<Ionicons name="volume-medium" size={22} color={NOTIFICATION_COLORS.icon} />}
            label="Allow sound"
            onToggle={setAllowSound}
            value={allowSound}
          />
          <NotificationToggleRow
            disabled={!showNotifications}
            icon={<MaterialCommunityIcons name="vibrate" size={22} color={NOTIFICATION_COLORS.icon} />}
            label="Allow vibration"
            onToggle={setAllowVibration}
            value={allowVibration}
          />
        </NotificationSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: NOTIFICATION_COLORS.background,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 26,
  },
});
