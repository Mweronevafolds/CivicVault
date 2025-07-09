import { StatusBar } from 'expo-status-bar';
import { OfflineProvider } from './src/context/OfflineContext';
import { Slot } from 'expo-router';

/**
 * This is the main entry point for the CivicVault application.
 * It sets up the core providers and navigation using Expo Router.
 */
export default function App() {
  return (
    <OfflineProvider>
      <Slot />
      <StatusBar style="auto" />
    </OfflineProvider>
  );
}
