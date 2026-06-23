import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppTheme } from '@/src/theme/app-theme';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 12;

  return (
    <View className="flex-1 bg-header-blue">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1">
          <KeyboardAvoidingView
            className="flex-1 bg-white"
            style={{ backgroundColor: colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                paddingTop: headerHeight + 32,
                paddingBottom: footerHeight + 28,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ width: 346 }}>
                <Text className="text-[32px] font-bold text-accent-green mb-3">
                  Forgot Password?
                </Text>
                <Text className="text-sm text-[#666] leading-5 mb-8" style={{ color: colors.textMuted }}>
                  Enter the email associated with your account and we&apos;ll send a code to your email to reset your password.
                </Text>

                <Text className="text-sm text-[#333] font-medium mb-[7px]" style={{ color: colors.text }}>Email</Text>
                <TextInput
                  className="bg-input-bg rounded-[12px] px-[14px] h-[56px] w-full text-base text-[#1A1A1A] mb-8"
                  style={{ backgroundColor: colors.input, color: colors.text }}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  className="bg-accent-green rounded-[12px] h-[56px] w-full items-center justify-center"
                  activeOpacity={0.85}
                  onPress={() => router.push('/(auth)/verify-code')}
                >
                  <Text className="text-white text-base font-bold">Send</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            className="bg-header-blue px-5 pt-3 pb-5 rounded-b-[28px]"
            onLayout={(e: LayoutChangeEvent) => setHeaderHeight(e.nativeEvent.layout.height)}
          >
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={18} color="#fff" />
              <Text className="text-white text-sm font-medium">Back</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: footerHeight }}
            className="bg-header-blue rounded-t-[28px]"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
