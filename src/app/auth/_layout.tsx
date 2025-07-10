import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const params = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}
