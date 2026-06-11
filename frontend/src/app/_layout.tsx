import { DarkTheme, DefaultTheme, ThemeProvider, router, useSegments, Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { authClient } from '@/lib/auth-client';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth screens
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace('/');
    }
  }, [session, isPending, segments]);

  if (isPending) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
      </ThemeProvider>
    );
  }

  // If not authenticated, render Slot (to show Login/Signup full-screen)
  if (!session) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
    );
  }

  // If authenticated, render AppTabs (the tab navigator)
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
