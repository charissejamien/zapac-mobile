import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SETTINGS_HEADER_GRADIENT } from './settings-theme';

type SettingsHeaderProps = {
  email: string;
  name: string;
  onEditProfile: () => void;
};

export function SettingsHeader({ email, name, onEditProfile }: SettingsHeaderProps) {
  return (
    <LinearGradient colors={SETTINGS_HEADER_GRADIENT} style={styles.header}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onEditProfile}
              style={styles.editBadge}
            >
              <Feather name="edit-2" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.accountType}>
            <MaterialCommunityIcons name="bus" size={13} color="#FFFFFF" />
            <Text style={styles.accountTypeText}>Daily Commuter</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 314,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 18,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },
  identity: {
    marginTop: 28,
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 27,
    height: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#75B399',
  },
  name: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  email: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  accountType: {
    height: 24,
    marginTop: 8,
    paddingHorizontal: 11,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  accountTypeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '500',
  },
});
