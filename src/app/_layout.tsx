import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

export default function RootLayout() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
