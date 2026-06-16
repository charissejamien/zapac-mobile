import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import {
  Image,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + 12;

  const switchTab = (next: 'login' | 'signup') => {
    setTab(next);
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
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
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, username });
    }
    router.replace('/onboarding');
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    const redirectUrl = Linking.createURL('/');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      setError('Could not open sign-in page');
      return;
    }
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
    if (result.type === 'success') {
      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code as string | undefined;
      if (code) {
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) setError(sessionError.message);
      }
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.inner}>

          {/* White card behind header and footer */}
          <KeyboardAvoidingView
            style={styles.card}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: headerHeight + 24,
                paddingBottom: footerHeight + 28,
                paddingHorizontal: 24,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View>
                <Text style={styles.heading}>
                  {tab === 'login' ? 'Welcome Back!' : 'Create an Account'}
                </Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor="#AAA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {tab === 'signup' && (
                  <>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Enter username"
                      placeholderTextColor="#AAA"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </>
                )}

                <Text style={styles.label}>Password</Text>
                <View>
                  <TextInput
                    style={[styles.input, { paddingRight: 48 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter Password"
                    placeholderTextColor="#AAA"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(v => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#4A6FA5" />
                  </TouchableOpacity>
                </View>

                {tab === 'signup' && (
                  <>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View>
                      <TextInput
                        style={[styles.input, { paddingRight: 48 }]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Enter Password"
                        placeholderTextColor="#AAA"
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPassword(v => !v)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#4A6FA5" />
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {error ? (
                  <View style={styles.errorRow}>
                    <AntDesign name="close-circle" size={13} color="#E53935" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                  onPress={tab === 'login' ? handleLogin : handleSignup}
                  activeOpacity={0.85}
                  disabled={loading}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading
                      ? tab === 'login' ? 'Logging in...' : 'Creating account...'
                      : tab === 'login' ? 'Login' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                {tab === 'login' && (
                  <View style={styles.forgotRow}>
                    <Text style={styles.forgotText}>Forgotten your password? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/reset-password')} activeOpacity={0.7}>
                      <Text style={styles.resetText}>Reset password</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>
                    {tab === 'login' ? 'or sign in with' : 'or sign up with'}
                  </Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.oauthRow}>
                  <TouchableOpacity
                    style={styles.googleBtn}
                    onPress={() => handleOAuth('google')}
                    activeOpacity={0.85}
                  >
                    <AntDesign name="google" size={17} color="#fff" />
                    <Text style={styles.googleBtnText}>Google</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.facebookBtn}
                    onPress={() => handleOAuth('facebook')}
                    activeOpacity={0.85}
                  >
                    <FontAwesome name="facebook" size={17} color="#1877F2" />
                    <Text style={styles.facebookBtnText}>Facebook</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Blue header — absolute, on top */}
          <View
            style={[styles.blueHeader, { position: 'absolute', top: 0, left: 0, right: 0 }]}
            onLayout={(e: LayoutChangeEvent) => setHeaderHeight(e.nativeEvent.layout.height)}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/bus_icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.logoShadow} />
            </View>

            <View style={styles.tabRow}>
              <TouchableOpacity
                style={styles.tabBtn}
                onPress={() => switchTab('signup')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, tab === 'signup' && styles.tabTextActive]}>
                  Sign Up
                </Text>
                {tab === 'signup' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabBtn}
                onPress={() => switchTab('login')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
                  Log In
                </Text>
                {tab === 'login' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Blue footer — absolute, rounded top */}
          <View style={[styles.blueFooter, { height: footerHeight }]} />

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#4A6FA5',
  },
  safeArea: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6CA89A',
    textAlign: 'center',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#F3EEE6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 56,
    width: '100%',
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 18,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 12,
  },
  errorText: {
    color: '#EA4335',
    fontSize: 12,
  },
  primaryBtn: {
    backgroundColor: '#6CA89A',
    borderRadius: 12,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 14,
    color: '#666',
  },
  resetText: {
    fontSize: 14,
    color: '#EA4335',
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    fontSize: 12,
    color: '#888',
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 12,
  },
  googleBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  facebookBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  facebookBtnText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600',
  },
  blueHeader: {
    backgroundColor: '#4A6FA5',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 120,
    height: 80,
    zIndex: 1,
  },
  logoShadow: {
    width: 58,
    height: 8,
    backgroundColor: '#F5C842',
    borderRadius: 50,
    position: 'absolute',
    bottom: -2,
    opacity: 0.65,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 40,
  },
  tabBtn: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  tabText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 3,
    borderRadius: 2,
  },
  blueFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4A6FA5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
});
