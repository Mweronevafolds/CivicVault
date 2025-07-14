import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].background,
        },
        headerTintColor: Colors[colorScheme].tint,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Login' }} />
    </Stack>
  );
}
