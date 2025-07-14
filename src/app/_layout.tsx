import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If we're still loading the user session, don't do anything yet.
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // If the user is signed in and is on a page in the (auth) group,
    // redirect them to the main app's home screen.
    if (user && inAuthGroup) {
      router.replace('/home');
    } 
    // If the user is not signed in and they are trying to access a page
    // inside the main app, redirect them to the login screen.
    else if (!user && !inAuthGroup) {
      router.replace('/');
    }
  }, [user, loading, segments]);

  // While checking for the user, show a loading spinner.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Once loading is complete, show the screen that Expo Router has matched.
  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
