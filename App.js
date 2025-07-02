import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { OfflineProvider } from './src/context/OfflineContext'; // UNCOMMENT THIS LINE
import AppNavigator from './src/navigation/AppNavigator';

/**
 * This is the main entry point for the CivicVault application.
 * It sets up the core providers and navigation.
 */
export default function App() {
  return (
    <>
      <OfflineProvider> 
        <AppNavigator />
      </OfflineProvider> 
      {/* UNCOMMENT THE <OfflineProvider> WRAPPER */}
      <StatusBar style="auto" />
    </>
  );
}
