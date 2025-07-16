import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { OfflineProvider } from '../context/OfflineContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// This component shows the system status bar with proper theming for edge-to-edge UI
function ThemedStatusBar() {
  const { isDark } = useTheme();
  
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 0, // Takes no space but provides the background
      zIndex: 1000,
    }}>
      <StatusBar 
        style={isDark ? 'light' : 'dark'} 
        backgroundColor="transparent"
        translucent={true}
      />
    </View>
  );
}

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If we're still loading the user session, don't do anything.
    if (loading) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';
    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // User is signed in and in the auth group.
      // Redirect them to the main app (home screen).
      router.replace('/(tabs)/home');
    } else if (!user && inTabsGroup) {
      // User is not signed in and trying to access a protected route.
      // Redirect them to the auth screen.
      router.replace('/(auth)');
    }
  }, [user, loading, segments]);

  if (loading) {
    // Show a loading spinner while we check for a session
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <ThemedStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: 'transparent',
            paddingTop: 0, // Remove any top padding that might affect status bar
          },
          animation: 'fade',
        }}
      >
        {/* Main app screens */}
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="view-applications" options={{ headerShown: false }} />
        
        {/* Auth screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* Modal screens */}
        <Stack.Screen name="map-modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="form" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="document-form" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </>
  );
};

const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#69C779', backgroundColor: '#F0FFF0', height: 'auto', minHeight: 60, paddingVertical: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#2E8B57'
      }}
      text2Style={{
        fontSize: 14,
        color: '#3CB371'
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#FF6347', backgroundColor: '#FFF0F0', height: 'auto', minHeight: 60, paddingVertical: 10 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#D22B2B'
      }}
      text2Style={{
        fontSize: 14,
        color: '#CD5C5C'
      }}
    />
  ),
};

export default function RootLayout() {
  return (
    // Wrap providers in correct hierarchy
    <SafeAreaProvider>
      <OfflineProvider>
        <AuthProvider>
          <ThemeProvider>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <ThemedStatusBar />
              <InitialLayout />
              <Toast config={toastConfig} />
            </View>
          </ThemeProvider>
        </AuthProvider>
      </OfflineProvider>
    </SafeAreaProvider>
  );
}
