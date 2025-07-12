import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { OfflineProvider } from '../context/OfflineContext';
import { ThemeProvider } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';

// This component applies the theme to the status bar
function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <OfflineProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Hide header by default for all screens
            contentStyle: { backgroundColor: 'transparent' },
            headerStyle: {
              backgroundColor: 'transparent',
            },
          headerTintColor: undefined,
          headerTitleStyle: {
            color: undefined,
          },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="home" />
        <Stack.Screen name="view-applications" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="document-form" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="map-modal" options={{ headerShown: true, headerStyle: { backgroundColor: '#343a40' }, headerTintColor: '#fff', title: 'Community Registrations Map' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </OfflineProvider>
    </ThemeProvider>
  );
}
