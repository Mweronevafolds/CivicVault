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
            contentStyle: { backgroundColor: 'transparent' },
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTintColor: undefined, // Let the theme handle this
            headerTitleStyle: {
              color: undefined, // Let the theme handle this
            },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </OfflineProvider>
    </ThemeProvider>
  );
}
