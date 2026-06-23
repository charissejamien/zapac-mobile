import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingDots } from '@/components/onboarding/onboarding-dots';
import { OnboardingSlide } from '@/components/onboarding/onboarding-slide';
import { ONBOARDING_SLIDES, type OnboardingSlide as SlideType } from '@/components/onboarding/onboarding-data';
import { useAppTheme } from '@/src/theme/app-theme';

const { width } = Dimensions.get('window');

async function finish() {
  router.replace('/(tabs)/dashboard');
}

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<SlideType>>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const goNext = () => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const handleEnableLocation = async () => {
    await Location.requestForegroundPermissionsAsync();
    await finish();
  };

  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={finish}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => <OnboardingSlide slide={item} />}
      />

      <View style={styles.footer}>
        <OnboardingDots count={ONBOARDING_SLIDES.length} activeIndex={activeIndex} />

        {isLastSlide ? (
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={handleEnableLocation}
            activeOpacity={0.85}
          >
            <Text style={styles.locationBtnText}>Enable Location</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navRow}>
            <View style={{ width: 60 }} />
            <TouchableOpacity onPress={goNext} activeOpacity={0.75}>
              <Text style={[styles.nextText, { color: colors.primary }]}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 16,
    gap: 20,
    alignItems: 'center',
  },
  navRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextText: {
    color: '#4A6FA5',
    fontSize: 15,
    fontWeight: '700',
  },
  locationBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#6CA89A',
    borderRadius: 14,
    alignItems: 'center',
  },
  locationBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
