import { Stack, useRouter, useSegments } from 'expo-router';
import 'react-native-reanimated';
import { OfflineProvider } from '../context/OfflineContext';
import { ThemeProvider } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';


// This component applies the theme to the status bar
function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Don't do anything until the auth state is loaded
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && !inAuthGroup) {
      // User is signed in and not in the auth group.
      // Redirect them to the main app (home screen).
      router.replace('/home');
    } else if (!user) {
      // User is not signed in.
      // Redirect them to the login screen.
      router.replace('/');
    }
  }, [user, loading]);

  if (loading) {
    // Show a loading spinner while we check for a session
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="map-modal" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      <Stack.Screen name="form" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    // Wrap providers in correct hierarchy
    <AuthProvider>
      <ThemeProvider>
        <OfflineProvider>
          <ThemedStatusBar />
          <InitialLayout />
        </OfflineProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
