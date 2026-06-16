export type OnboardingSlide = {
  id: string;
  image: ReturnType<typeof require>;
  title: string;
  description: string;
  isLocationSlide?: boolean;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../../assets/images/bus_icon.png'),
    title: 'WELCOME TO ZAPAC!',
    description: 'Your smart guide to getting around Cebu. Fast, simple, and built for everyday commuters.',
  },
  {
    id: '2',
    image: require('../../assets/images/onboarding1.png'),
    title: 'COMMUTING IN CEBU, SIMPLIFIED.',
    description: "From IT Park to Colon, navigating the city shouldn't be a guessing game. Zapac makes it a breeze.",
  },
  {
    id: '3',
    image: require('../../assets/images/onboarding2.png'),
    title: 'Never Ask "Asa ni Muagi?" Again.',
    description: "Confused by jeepney routes? Just type your destination. We'll show you exactly which Jeep or Bus to take and where to say 'Para!'",
  },
  {
    id: '4',
    image: require('../../assets/images/onboarding3.png'),
    title: "Know Your 'Plete' Before You Hop On",
    description: "No more guessing how much to pay. We'll calculate fare estimates for Jeeps, Modern Jeeps, and Buses so you can prepare your coins.",
  },
  {
    id: '5',
    image: require('../../assets/images/onboarding1.png'),
    title: 'Ready to Zap around Cebu?',
    description: 'Enable your location to find the nearest stops around you. We protect your privacy and only use location for navigation.',
    isLocationSlide: true,
  },
];
