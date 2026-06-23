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

export default function NewPasswordScreen() {
  const { colors } = useAppTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
                  Create New Password
                </Text>
                <Text className="text-sm text-[#666] leading-5 mb-8" style={{ color: colors.textMuted }}>
                  Your new password must be different from previous used passwords.
                </Text>

                <Text className="text-sm text-[#333] font-medium mb-[7px]" style={{ color: colors.text }}>Password</Text>
                <View className="relative mb-1">
                  <TextInput
                    className="bg-input-bg rounded-[12px] px-[14px] pr-12 h-[56px] w-full text-base text-[#1A1A1A]"
                    style={{ backgroundColor: colors.input, color: colors.text }}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter Password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-[14px] top-[18px]"
                    onPress={() => setShowPassword(v => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#4A6FA5" />
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-[#888] mb-5" style={{ color: colors.textMuted }}>Must be at least 8 characters.</Text>

                <Text className="text-sm text-[#333] font-medium mb-[7px]" style={{ color: colors.text }}>Confirm Password</Text>
                <View className="relative mb-1">
                  <TextInput
                    className="bg-input-bg rounded-[12px] px-[14px] pr-12 h-[56px] w-full text-base text-[#1A1A1A]"
                    style={{ backgroundColor: colors.input, color: colors.text }}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Enter New Password"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-[14px] top-[18px]"
                    onPress={() => setShowPassword(v => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#4A6FA5" />
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-[#888] mb-8" style={{ color: colors.textMuted }}>Both passwords must match.</Text>

                <TouchableOpacity
                  className="bg-accent-green rounded-[12px] h-[56px] w-full items-center justify-center"
                  activeOpacity={0.85}
                  onPress={() => {/* TODO: submit new password */}}
                >
                  <Text className="text-white text-base font-bold">Reset Password</Text>
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
