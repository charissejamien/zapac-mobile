import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SETTINGS_HEADER_GRADIENT } from './settings-theme';

type SettingsHeaderProps = {
  email: string;
  name: string;
  avatarUrl?: string;
  onEditProfile: () => void;
  onAvatarPress: () => void;
  onEditUsername: () => void;
};

export function SettingsHeader({ email, name, avatarUrl, onEditProfile, onAvatarPress, onEditUsername }: SettingsHeaderProps) {
  return (
    <LinearGradient colors={SETTINGS_HEADER_GRADIENT} style={styles.header}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.identity}>
          <TouchableOpacity activeOpacity={0.8} onPress={onAvatarPress} style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
              ) : (
                <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <View style={styles.editBadge}>
              <Feather name="camera" size={13} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <TouchableOpacity
              onPress={onEditUsername}
              style={styles.editNameBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="edit-2" size={12} color="rgba(255,255,255,0.75)" />
            </TouchableOpacity>
          </View>
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
  header: {},
  safeArea: {
    alignItems: 'center',
    paddingBottom: 28,
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
  avatarWrapper: {
    width: 84,
    height: 84,
  },
  avatar: {
    width: 84,
    height: 84,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  nameRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  editNameBtn: {
    marginTop: 2,
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
