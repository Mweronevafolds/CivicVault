import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../config/firebase-init';
import { useTheme } from '../context/ThemeContext';

// A standard blue color for the theme. You can change this later.
const THEME_COLOR = '#007AFF';

interface MenuItem {
  title: string;
  icon: string;
  screen: '/camera' | '/view-applications' | '/dashboard';
  params?: { docType: 'birth' | 'id' };
};

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const colors = theme.colors;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      if (!user) {
        router.replace('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);
  
  // Remove unused useLocalSearchParams since we're using user from auth state
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

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
  
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    // Header Styles with curved bottom
    headerContainer: {
      paddingTop: 50,
      paddingBottom: 35, // Extra padding at bottom for the curve
      paddingHorizontal: 20,
      backgroundColor: theme.colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
      marginBottom: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      overflow: 'hidden',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    greetingContainer: {
      flex: 1,
    },
    welcomeText: {
      fontSize: 20,
      marginBottom: 8,
      fontWeight: '500',
      color: colors.text,
      lineHeight: 28,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: 'System',
      opacity: 0.8,
    },

    userEmail: {
      fontSize: 14,
      color: theme.colors.text + '99',
      fontFamily: 'System',
    },


    grid: {
      flex: 1,
      padding: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingTop: 30,
    },
    card: {
      width: '47%',
      aspectRatio: 1,
      backgroundColor: colors.card,
      padding: 20,
      marginBottom: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      shadowColor: colors.primary + '40',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border + '20',
      transform: [{ translateY: 0 }],
    },
    cardActive: {
      transform: [{ translateY: -2 }],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 6,
    },
    cardText: {
      marginTop: 8,
      textAlign: 'center',
      color: colors.text,
      fontSize: 14,
    },
    cardTitle: {
      marginTop: 12,
      textAlign: 'center',
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
      fontFamily: 'System',
      letterSpacing: 0.3,
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
      bottom: 40,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    logoutButton: {
      backgroundColor: colors.error,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
      width: '100%',
      maxWidth: 220,
      transform: [{ translateY: 0 }],
    },
    logoutButtonActive: {
      transform: [{ translateY: -2 }],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 7,
    },
    logoutButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
      marginLeft: 10,
      letterSpacing: 0.5,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    logoutIcon: {
      marginRight: 6,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
  });


  
  // Format the display name or extract from email if not available
  const getDisplayName = () => {
    // If display name is available, format it properly
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
        .join(' ');
    }
    
    // If email is available, extract the username part (before @)
    if (user?.email) {
      const email = user.email;
      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        const username = email.substring(0, atIndex);
        // Remove any numbers or special characters and format
        return username
          .replace(/[0-9._-]/g, ' ')
          .split(' ')
          .filter(Boolean)
          .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
          .join(' ');
      }
      return email;
    }
    
    return 'User';
  };
  
  const formattedDisplayName = getDisplayName();

  // Create menu item components with their own state
  const MenuItemButton = ({ item }: { item: typeof menuItems[0] }) => {
    const [isPressed, setIsPressed] = useState(false);
    
    return (
      <TouchableOpacity
        style={[
          themedStyles.card,
          isPressed && themedStyles.cardActive,
          { backgroundColor: theme.colors.card }
        ]}
        activeOpacity={0.9}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => router.push({
          pathname: item.screen,
          params: item.params
        })}
      >
        <View style={[
          themedStyles.iconContainer,
          { backgroundColor: theme.colors.primary + '15' }
        ]}>
          <MaterialCommunityIcons 
            name={item.icon as any} 
            size={28} 
            color={theme.colors.primary}
          />
        </View>
        <Text style={[themedStyles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={themedStyles.container}>
      {/* Welcome Header */}
      <View style={[themedStyles.headerContainer, { 
        backgroundColor: theme.colors.card,
      }]}>
        <View style={themedStyles.headerContent}>
          <View style={themedStyles.greetingContainer}>
            <Text style={[themedStyles.welcomeText, { color: theme.colors.text }]}>
              Welcome back,{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                {formattedDisplayName || 'User'}
              </Text>
            </Text>
            <Text style={[themedStyles.subtitle, { color: theme.colors.text + 'CC' }]}>
              What would you like to do today?
            </Text>
          </View>
        </View>
      </View>
      
      <View style={themedStyles.grid}>
        {menuItems.map((item, index) => (
          <MenuItemButton key={index} item={item} />
        ))}
      </View>
      
      <View style={themedStyles.logoutButtonContainer}>
        {(() => {
          const LogoutButton = () => {
            const [isPressed, setIsPressed] = useState(false);
            
            return (
              <TouchableOpacity 
                onPress={handleLogout}
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                style={[
                  themedStyles.logoutButton,
                  isPressed && themedStyles.logoutButtonActive
                ]}
                activeOpacity={0.9}
              >
                <MaterialCommunityIcons 
                  name="logout" 
                  size={20} 
                  color="#fff" 
                  style={themedStyles.logoutIcon} 
                />
                <Text style={themedStyles.logoutButtonText}>Sign Out</Text>
              </TouchableOpacity>
            );
          };
          
          return <LogoutButton />;
        })()}
      </View>
      
      <Text style={themedStyles.footerText}>INCLUSIVE BIRTH & ID REGISTRATION</Text>
    </View>
  );
}
