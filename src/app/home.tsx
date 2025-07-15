import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList, Platform, RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getPendingSubmissionsForAdmin } from '../../src/api/ApiService';
import { supabase } from '../../src/config/client';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

type AppRoute = 
  | '/camera' 
  | '/dashboard' 
  | '/document-form' 
  | '/form' 
  | '/home' 
  | '/' 
  | '/map-modal' 
  | '/signup' 
  | '/view-applications' 
  | '/_sitemap' 
  | '/(auth)' 
  | '/auth';

type Submission = {
  id: string;
  doc_type: string;
  full_name: string;
  created_at: string;
  status?: string;
};

type Profile = {
  username?: string;
};


// --- Mobile Dashboard Component ---
const MobileDashboard = ({ onNavigate, isAdmin, profile }: { onNavigate: (screen: AppRoute, params?: any) => void, isAdmin: boolean, profile: Profile }) => {
    const router = useRouter();
    const { colors } = useTheme();

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error signing out:', error);
                return;
            }
            // Reset navigation to the auth screen after sign out
            router.replace('/(auth)');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const renderDashboardCard = (title: string, icon: string, route: AppRoute, params?: any) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} 
            onPress={() => onNavigate(route, params)}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name={icon as any} size={32} color={colors.primary} />
            </View>
            <Text style={[styles.cardText, { color: colors.text }]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.mobileContainer, { backgroundColor: colors.background }]}>
            <View style={styles.headerContainer}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity 
                    onPress={handleSignOut} 
                    style={[styles.signOutButton, { backgroundColor: colors.card }]}
                >
                    <Ionicons name="log-out-outline" size={24} color={colors.error} />
                    <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardContainer}>
                {renderDashboardCard('Register Birth', 'person-add-outline', '/camera' as AppRoute, { type: 'birth' })}
                {renderDashboardCard('Request ID', 'id-card-outline', '/camera' as AppRoute, { type: 'id' })}
            </View>
            <View style={styles.cardContainer}>
                {renderDashboardCard('View Applications', 'document-text-outline', '/view-applications' as AppRoute)}
                {isAdmin && renderDashboardCard('Dashboard', 'apps-outline', '/dashboard' as AppRoute)}
            </View>
        </View>
    );
};

// --- Main Component ---
export default function HomeScreen() {
  const { profile, isAdmin, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter(); // Correctly call the hook here

  useEffect(() => {
    if (!loading && profile) {
      Toast.show({
        type: 'success',
        text1: `Welcome, ${profile.username || 'User'}!`,
        text2: `You are logged in as an ${isAdmin ? 'Admin' : 'User'}.`
      });
    }
  }, [profile, loading, isAdmin]);

  // This function now uses the router instance from the hook
  const handleNavigation = (screen: AppRoute, params?: any) => {
    router.push({ pathname: screen, params });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <MobileDashboard onNavigate={handleNavigation} isAdmin={isAdmin} profile={profile} />
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
    // Mobile Styles
    mobileContainer: { 
        flex: 1, 
        padding: 20 
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    greeting: { 
        fontSize: 24, 
        fontWeight: 'bold',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    signOutText: {
        marginLeft: 6,
        fontWeight: '500',
        fontSize: 14,
    },
    cardContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 10,
    },
    card: { 
        width: '48%', 
        aspectRatio: 1, 
        borderRadius: 15, 
        padding: 20, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardText: { 
        marginTop: 8, 
        fontWeight: '600', 
        textAlign: 'center', 
        fontSize: 15,
    }
});
