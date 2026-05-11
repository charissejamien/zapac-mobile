import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExampleScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center px-6 pt-16">

        {/* Header */}
        <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Example Tab
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-8">
          Built with NativeWind + Tailwind CSS
        </Text>

        {/* Card */}
        <View className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-1">
            🎨 Styled with Tailwind
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            This card is using NativeWind utility classes just like you would on the web.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity className="w-full bg-blue-500 active:bg-blue-600 rounded-xl py-4 items-center mt-2">
          <Text className="text-white font-bold text-base">
            Tap Me
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}