import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { type OnboardingSlide } from './onboarding-data';

const { width } = Dimensions.get('window');

type Props = {
  slide: OnboardingSlide;
};

export function OnboardingSlide({ slide }: Props) {
  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={slide.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: width * 0.72,
    height: width * 0.72,
  },
  textContainer: {
    paddingBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4A6FA5',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
