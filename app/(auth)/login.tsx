import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
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

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 12;

  const switchTab = (next: 'login' | 'signup') => {
    setTab(next);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    // TODO: supabase.auth.signInWithPassword({ email, password })
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    // TODO: supabase.auth.signUp({ email, password })
    setLoading(false);
  };

  const handleGoogle = () => {
    // TODO: supabase.auth.signInWithOAuth({ provider: 'google' })
  };

  const handleFacebook = () => {
    // TODO: supabase.auth.signInWithOAuth({ provider: 'facebook' })
  };

  return (
    <View className="flex-1 bg-header-blue">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-1">

          {/* White card — fills full height, behind both header and footer */}
          <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: headerHeight + 24,
                paddingBottom: footerHeight + 28,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="text-[26px] font-bold text-accent-green text-center mb-7">
                {tab === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </Text>

              <Text className="text-[13px] text-[#333] font-medium mb-[7px]">Email</Text>
              <TextInput
                className="bg-input-bg rounded-[10px] px-[14px] py-[14px] text-sm text-[#1A1A1A] mb-4"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor="#AAA"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text className="text-[13px] text-[#333] font-medium mb-[7px]">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-input-bg rounded-[10px] px-[14px] py-[14px] pr-12 text-sm text-[#1A1A1A] mb-4"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  placeholderTextColor="#AAA"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-[14px] top-[14px]"
                  onPress={() => setShowPassword(v => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
                </TouchableOpacity>
              </View>

              {tab === 'signup' && (
                <>
                  <Text className="text-[13px] text-[#333] font-medium mb-[7px]">Confirm Password</Text>
                  <View className="relative">
                    <TextInput
                      className="bg-input-bg rounded-[10px] px-[14px] py-[14px] pr-12 text-sm text-[#1A1A1A] mb-4"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Enter Password"
                      placeholderTextColor="#AAA"
                      secureTextEntry={!showConfirm}
                    />
                    <TouchableOpacity
                      className="absolute right-[14px] top-[14px]"
                      onPress={() => setShowConfirm(v => !v)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Feather name={showConfirm ? 'eye' : 'eye-off'} size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {error ? (
                <View className="flex-row items-center gap-[6px] -mt-2 mb-3">
                  <AntDesign name="close-circle" size={13} color="#E53935" />
                  <Text className="text-error-red text-xs">{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                className={`bg-accent-green rounded-[12px] py-4 items-center mt-1 mb-4 ${loading ? 'opacity-70' : ''}`}
                onPress={tab === 'login' ? handleLogin : handleSignup}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text className="text-white text-base font-bold">
                  {loading
                    ? tab === 'login' ? 'Logging in...' : 'Creating account...'
                    : tab === 'login' ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              {tab === 'login' && (
                <View className="flex-row justify-center items-center mb-2">
                  <Text className="text-[13px] text-[#666]">Forgotten your password? </Text>
                  {/* <TouchableOpacity onPress={() => router.push('/(auth)/reset-password')}>
                    <Text className="text-[13px] text-accent-green font-semibold">Reset password</Text>
                  </TouchableOpacity> */}
                </View>
              )}

              <View className="flex-row items-center gap-[10px] mb-5 mt-2">
                <View className="flex-1 h-px bg-[#DDD]" />
                <Text className="text-xs text-[#888]">
                  {tab === 'login' ? 'or sign in with' : 'or sign up with'}
                </Text>
                <View className="flex-1 h-px bg-[#DDD]" />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 flex-row bg-[#1A1A1A] rounded-[10px] py-[13px] items-center justify-center gap-2"
                  onPress={handleGoogle}
                  activeOpacity={0.85}
                >
                  <AntDesign name="google" size={17} color="#fff" />
                  <Text className="text-white text-sm font-semibold">Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row bg-white rounded-[10px] border-[1.5px] border-[#E0E0E0] py-[13px] items-center justify-center gap-2"
                  onPress={handleFacebook}
                  activeOpacity={0.85}
                >
                  <FontAwesome name="facebook" size={17} color="#1877F2" />
                  <Text className="text-[#1A1A1A] text-sm font-semibold">Facebook</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Blue header — absolute, on top, rounded bottom */}
          <View
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            className="bg-header-blue items-center pt-5 pb-6 rounded-b-[28px]"
            onLayout={(e: LayoutChangeEvent) => setHeaderHeight(e.nativeEvent.layout.height)}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={require('../../assets/images/bus_icon.png')}
                style={{ width: 120, height: 80, zIndex: 1 }}
                resizeMode="contain"
              />
              <View style={{
                width: 58,
                height: 8,
                backgroundColor: '#F5C842',
                borderRadius: 50,
                position: 'absolute',
                bottom: -2,
                opacity: 0.65,
              }} />
            </View>

            <View className="flex-row gap-10">
              <TouchableOpacity
                className="items-center px-1 pb-1"
                onPress={() => switchTab('signup')}
                activeOpacity={0.7}
              >
                <Text className={`text-[15px] ${tab === 'signup' ? 'text-white font-bold' : 'text-white/[0.65] font-medium'}`}>
                  Sign Up
                </Text>
                {tab === 'signup' && <View className="h-0.5 bg-white w-full mt-[3px] rounded-sm" />}
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center px-1 pb-1"
                onPress={() => switchTab('login')}
                activeOpacity={0.7}
              >
                <Text className={`text-[15px] ${tab === 'login' ? 'text-white font-bold' : 'text-white/[0.65] font-medium'}`}>
                  Log In
                </Text>
                {tab === 'login' && <View className="h-0.5 bg-white w-full mt-[3px] rounded-sm" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Blue footer — absolute, on top, rounded top */}
          <View
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: footerHeight }}
            className="bg-header-blue rounded-t-[28px]"
          />

        </View>
      </SafeAreaView>
    </View>
  );
}
