import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { useAppTheme } from '@/src/theme/app-theme';

export default function CompleteProfileScreen() {
  const { colors, isDark } = useAppTheme();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Session expired. Please sign in again.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      username: trimmed,
    });

    if (insertError) {
      if (insertError.message.includes('duplicate') || insertError.code === '23505') {
        setError('Username is already taken');
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    router.replace('/onboarding');
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#18283B' : '#4A6FA5' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Almost there!</Text>
            <Text style={styles.subtitle}>Choose a username to get started</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <Text style={[styles.label, { color: colors.text }]}>Username</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />

            {error ? (
              <View style={styles.errorRow}>
                <AntDesign name="close-circle" size={13} color="#E53935" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleContinue}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? 'Setting up...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    borderRadius: 20,
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 7,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 56,
    width: '100%',
    fontSize: 16,
    marginBottom: 16,
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
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
