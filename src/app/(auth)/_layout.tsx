import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return (
    <StatusBar 
      style={isDark ? 'light' : 'dark'} 
      backgroundColor="transparent"
      translucent={true}
    />
  );
}

export default function AuthLayout() {
  return (
    <>
      <ThemedStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: 'transparent',
            paddingTop: 0,
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            contentStyle: {
              backgroundColor: 'transparent',
              paddingTop: 0,
            },
          }} 
        />
      </Stack>
    </>
  );
}
