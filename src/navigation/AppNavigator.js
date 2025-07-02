import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ViewApplicationsScreen from '../screens/ViewApplicationsScreen';
import ApplicationDetailsScreen from '../screens/ApplicationDetailsScreen';

const Stack = createStackNavigator();

/**
 * AppNavigator defines the navigation stack for the application.
 * It lists all the screens and manages the flow between them.
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'CivicVault',
            headerBackTitle: 'Logout',
          }} 
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ 
            title: 'Capture Document',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="ViewApplications" 
          component={ViewApplicationsScreen} 
          options={{ 
            title: 'My Applications',
            headerBackTitle: 'Back',
          }} 
        />
        <Stack.Screen 
          name="ApplicationDetails" 
          component={ApplicationDetailsScreen} 
          options={{ 
            title: 'Application Details',
            headerBackTitle: 'Back',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
