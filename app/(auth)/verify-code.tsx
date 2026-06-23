import { Feather } from '@expo/vector-icons';
import { useRef, useState } from 'react';
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

const CODE_LENGTH = 6;

export default function VerifyCodeScreen() {
  const { colors } = useAppTheme();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [headerHeight, setHeaderHeight] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);
  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 12;

  const handleChange = (text: string, index: number) => {
    const updated = [...code];
    updated[index] = text.slice(-1);
    setCode(updated);
    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

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
                  Enter Code
                </Text>
                <Text className="text-sm text-[#666] leading-5 mb-10" style={{ color: colors.textMuted }}>
                  Enter the code we sent you as verification to reset your password.
                </Text>

                <Text className="text-sm text-[#333] font-medium mb-4" style={{ color: colors.text }}>Code</Text>
                <View className="flex-row justify-between mb-10">
                  {Array(CODE_LENGTH).fill(0).map((_, i) => (
                    <TextInput
                      key={i}
                      ref={el => { inputs.current[i] = el; }}
                      className="bg-input-bg rounded-[10px] text-base text-center text-[#1A1A1A] font-semibold"
                      style={{ width: 46, height: 52, backgroundColor: colors.input, color: colors.text }}
                      value={code[i]}
                      onChangeText={text => handleChange(text, i)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      returnKeyType="next"
                    />
                  ))}
                </View>

                <TouchableOpacity
                  className="bg-accent-green rounded-[12px] h-[56px] w-full items-center justify-center mb-5"
                  activeOpacity={0.85}
                  onPress={() => router.push('/(auth)/new-password')}
                >
                  <Text className="text-white text-base font-bold">Confirm</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center gap-1">
                  <Text className="text-sm text-[#666]" style={{ color: colors.textMuted }}>Didn&apos;t receive code?</Text>
                  <TouchableOpacity onPress={() => {/* TODO: resend */}} activeOpacity={0.7}>
                    <Text className="text-sm text-error-red font-semibold">Resend Now</Text>
                  </TouchableOpacity>
                </View>
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
