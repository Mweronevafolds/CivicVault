import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { OfflineProvider } from '../context/OfflineContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),

  });

  if (!loaded) {
    return null;
  }

  return (
    <OfflineProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </OfflineProvider>
  );
}
