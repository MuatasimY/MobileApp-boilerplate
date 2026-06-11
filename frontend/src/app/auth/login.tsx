import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { authClient } from '@/lib/auth-client';

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Failed to sign in');
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github' | 'apple') => {
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await authClient.signIn.social({
        provider,
      });

      if (authError) {
        setError(authError.message || `Failed to sign in with ${provider}`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>Welcome Back</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Sign in to access your account
            </ThemedText>
          </View>

          {error ? (
            <View style={[styles.errorContainer, { backgroundColor: '#FFEDED' }]}>
              <ThemedText style={{ color: '#CC0000', fontSize: 14 }}>{error}</ThemedText>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
                placeholder="email@example.com"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundElement,
                    color: theme.text,
                    borderColor: theme.backgroundSelected,
                  },
                ]}
                placeholder="••••••••"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.text, opacity: pressed || loading ? 0.8 : 1.0 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.background} />
              ) : (
                <ThemedText style={[styles.buttonText, { color: theme.background }]}>
                  Sign In
                </ThemedText>
              )}
            </Pressable>
          </View>

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundSelected }]} />
            <ThemedText themeColor="textSecondary" style={styles.dividerText}>or continue with</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundSelected }]} />
          </View>

          <View style={styles.socialContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handleSocialSignIn('google')}
              disabled={loading}
            >
              <SymbolView tintColor={theme.text} name={{ ios: 'g.circle', android: 'account-circle', web: 'account-circle' }} size={20} />
              <ThemedText type="small">Google</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handleSocialSignIn('github')}
              disabled={loading}
            >
              <SymbolView tintColor={theme.text} name={{ ios: 'github', android: 'code', web: 'code' }} size={20} />
              <ThemedText type="small">GitHub</ThemedText>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <ThemedText themeColor="textSecondary">{"Don't have an account? "}</ThemedText>
            <Pressable onPress={() => router.push('/auth/signup')}>
              <ThemedText type="linkPrimary">Sign Up</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: Spacing.five,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  errorContainer: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.four,
    alignItems: 'center',
  },
  form: {
    gap: Spacing.four,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.one,
  },
  input: {
    height: 50,
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.five,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.three,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: Spacing.three,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
});
