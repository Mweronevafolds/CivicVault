import React from 'react';
import { useRouter } from 'expo-router';
import DashboardScreen from '../screens/DashboardScreen';

export default function Dashboard() {
  const router = useRouter();
  
  return (
    <DashboardScreen 
      navigation={{
        goBack: () => router.back()
      }} 
    />
  );
}
