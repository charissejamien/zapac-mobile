import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { ABOUT_COLORS } from './about-theme';

const FEATURES = [
  { icon: 'map-pin' as const, label: 'Local routes' },
  { icon: 'users' as const, label: 'Community-led' },
  { icon: 'shield' as const, label: 'Safer trips' },
];

export function AboutHero() {
  return (
    <LinearGradient colors={['#EEF5FD', '#FFFFFF']} style={styles.card}>
      <View style={styles.decorativeCircle} />
      <View style={styles.iconBadge}>
        <MaterialCommunityIcons name="navigation-variant" size={37} color="#FFFFFF" />
      </View>
      <Text style={styles.eyebrow}>HELLO, COMMUTER</Text>
      <Text style={styles.title}>Your Guide to Cebuano Transit</Text>
      <Text style={styles.description}>
        ZAPAC makes navigating Cebu&apos;s public and private transportation simple, safe, and
        community-driven. Find real-time routes, clearer fare estimates, and local insights that
        help you move smarter across the city.
      </Text>

      <View style={styles.features}>
        {FEATURES.map(feature => (
          <View key={feature.label} style={styles.feature}>
            <Feather name={feature.icon} size={14} color={ABOUT_COLORS.blue} />
            <Text style={styles.featureText}>{feature.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3ECF6',
    borderRadius: 19,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -48,
    right: -36,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(112, 178, 166, 0.14)',
  },
  iconBadge: {
    width: 66,
    height: 66,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ABOUT_COLORS.blue,
    transform: [{ rotate: '-10deg' }],
  },
  eyebrow: {
    marginTop: 18,
    color: ABOUT_COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.65,
  },
  title: {
    marginTop: 6,
    color: ABOUT_COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  description: {
    marginTop: 11,
    color: ABOUT_COLORS.mutedText,
    fontSize: 14,
    lineHeight: 21,
  },
  features: {
    marginTop: 17,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  feature: {
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E9F1FA',
  },
  featureText: {
    color: ABOUT_COLORS.blue,
    fontSize: 11,
    fontWeight: '700',
  },
});
