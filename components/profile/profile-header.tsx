import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PROFILE_COLORS, PROFILE_HEADER_GRADIENT } from './profile-theme';

type ProfileHeaderProps = {
  email: string;
  name: string;
  onBack: () => void;
};

export function ProfileHeader({ email, name, onBack }: ProfileHeaderProps) {
  return (
    <LinearGradient
      colors={PROFILE_HEADER_GRADIENT}
      locations={[0, 0.65, 1]}
      style={styles.header}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.toolbar}>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={onBack}
          >
            <Feather name="chevron-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.toolbarSpacer} />
        </View>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={13} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.accountType}>
            <MaterialCommunityIcons name="shield-check" size={13} color="#FFFFFF" />
            <Text style={styles.accountTypeText}>Daily Commuter</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 310,
  },
  safeArea: {
    flex: 1,
  },
  toolbar: {
    height: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbarSpacer: {
    width: 28,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },
  identity: {
    alignItems: 'center',
    paddingTop: 8,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: PROFILE_COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  email: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
  },
  accountType: {
    marginTop: 8,
    paddingHorizontal: 11,
    height: 24,
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
