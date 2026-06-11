import React, { useState } from 'react';
import { StyleSheet, Pressable, ActivityIndicator, View, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { authClient } from '@/lib/auth-client';

export default function ProfileScreen() {
  const theme = useTheme();
  const { data: session, isPending } = authClient.useSession();
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await authClient.signOut();
      router.replace('/auth/login');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setSignOutLoading(false);
    }
  };

  const testAuthenticatedAPI = async () => {
    setApiLoading(true);
    setApiResult(null);
    try {
      const response = await authClient.fetch('/api/user/profile');
      if (response.ok) {
        const json = await response.json();
        setApiResult(json);
      } else {
        setApiResult({ error: `HTTP Error ${response.status}: ${response.statusText}` });
      }
    } catch (err: any) {
      setApiResult({ error: err.message || 'Network error occurred' });
    } finally {
      setApiLoading(false);
    }
  };

  if (isPending) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.text} />
      </ThemedView>
    );
  }

  const user = session?.user;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>Your Profile</ThemedText>
        </View>

        {user ? (
          <ThemedView type="backgroundElement" style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user.image ? (
                <Image source={{ uri: user.image }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.backgroundSelected }]}>
                  <SymbolView tintColor={theme.text} name={{ ios: 'person.fill', android: 'account-circle', web: 'account-circle' }} size={48} />
                </View>
              )}
            </View>

            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{user.name || 'Anonymous User'}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.userEmail}>{user.email}</ThemedText>
            </View>
          </ThemedView>
        ) : (
          <ThemedView type="backgroundElement" style={styles.profileCard}>
            <ThemedText>No active session found</ThemedText>
          </ThemedView>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Boilerplate Testing</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.sectionDesc}>
            {"Test the authenticated API middleware on the Express backend."}
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.testButton,
              { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={testAuthenticatedAPI}
            disabled={apiLoading}
          >
            {apiLoading ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <>
                <SymbolView tintColor={theme.text} name={{ ios: 'network', android: 'public', web: 'public' }} size={16} />
                <ThemedText type="smallBold">Request Protected Endpoint</ThemedText>
              </>
            )}
          </Pressable>

          {apiResult ? (
            <View style={[styles.resultBox, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}>
              <ThemedText type="code" style={styles.resultText}>
                {JSON.stringify(apiResult, null, 2)}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            { backgroundColor: '#FFEDED', opacity: pressed || signOutLoading ? 0.8 : 1 },
          ]}
          onPress={handleSignOut}
          disabled={signOutLoading}
        >
          {signOutLoading ? (
            <ActivityIndicator color="#CC0000" />
          ) : (
            <>
              <SymbolView tintColor="#CC0000" name={{ ios: 'arrow.uturn.left', android: 'exit-to-app', web: 'exit-to-app' }} size={16} />
              <ThemedText style={{ color: '#CC0000', fontWeight: '700' }}>Sign Out</ThemedText>
            </>
          )}
        </Pressable>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  title: {
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDesc: {
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  testButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: Spacing.three,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  resultBox: {
    borderRadius: Spacing.two,
    borderWidth: 1,
    padding: Spacing.three,
    marginTop: Spacing.two,
  },
  resultText: {
    fontSize: 11,
  },
  signOutButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
});
