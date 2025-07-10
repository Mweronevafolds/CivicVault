import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase-init';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';

// A standard blue color for the theme. You can change this later.
const THEME_COLOR = '#007AFF';

type MenuItem = {
  title: string;
  icon: string;
  screen: '/camera' | '/view-applications';
  params?: { docType: 'birth' | 'id' };
} | {
  title: string;
  icon: string;
  screen: string;
  params?: undefined;
};

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      if (!user) {
        router.replace('/auth');
      }
    });

    return () => unsubscribe();
  }, []);
  const { userName } = useLocalSearchParams();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // The auth state listener in the useEffect will handle the redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { title: 'Register Birth', icon: 'baby-face-outline', screen: '/camera', params: { docType: 'birth' } },
    { title: 'Request ID', icon: 'card-account-details-outline', screen: '/camera', params: { docType: 'id' } },
    { title: 'View My Applications', icon: 'file-document-multiple-outline', screen: '/view-applications' },
    { title: 'Dashboard', icon: 'view-dashboard-outline', screen: '/dashboard' },
  ] as MenuItem[];

  const { colors } = useTheme();
  
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },

    logoutButton: {
      backgroundColor: colors.error,
      padding: 8,
      borderRadius: 20,
    },
    grid: {
      flex: 1,
      padding: 15,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      width: '48%',
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 15,
      marginBottom: 15,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardText: {
      marginTop: 10,
      fontSize: 14,
      textAlign: 'center',
      color: colors.text,
    },
    footerText: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      color: 'gray',
      fontSize: 12,
    },
    logoutButtonContainer: {
      position: 'absolute',
      bottom: 50,
      width: '100%',
      alignItems: 'center',
    }
  });

  // Extract just the username part from email (before @) if available
  const displayName = user?.email ? user.email.split('@')[0] : userName || 'User';
  
  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.title}>Welcome, {displayName}!</Text>
      </View>
      
      <View style={themedStyles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={themedStyles.card}
            onPress={() => router.push({
              pathname: item.screen,
              params: item.params
            })}
          >
            <MaterialCommunityIcons 
              name={item.icon as any} 
              size={32} 
              color={colors.primary} 
            />
            <Text style={themedStyles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={themedStyles.logoutButtonContainer}>
        <TouchableOpacity 
          onPress={handleLogout} 
          style={[themedStyles.logoutButton, { 
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
            backgroundColor: colors.error,
          }]}
        >
          <Text style={{ 
            color: colors.buttonText, 
            fontWeight: '600',
            fontSize: 16,
          }}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={themedStyles.footerText}>INCLUSIVE BIRTH & ID REGISTRATION</Text>
    </View>
  );
}
