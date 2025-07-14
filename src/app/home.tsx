import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView, 
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
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

// --- Admin Panel Component (for Web) ---
const AdminDashboard = () => {
    const [applications, setApplications] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const pendingApps = await getPendingSubmissionsForAdmin();
            setApplications(pendingApps || []);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('Unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderApplicationItem = ({ item }: {item: Submission}) => (
        <TouchableOpacity style={styles.adminItem}>
            <Ionicons 
                name={item.doc_type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'} 
                size={24} 
                color="#4b5563" 
            />
            <View style={styles.adminItemDetails}>
                <Text style={styles.adminItemName}>{item.full_name}</Text>
                <Text style={styles.adminItemType}>{item.doc_type}</Text>
            </View>
            <Text style={styles.adminItemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.adminContainer}>
            <Text style={styles.adminTitle}>Pending Applications ({applications.length})</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderApplicationItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>No pending applications.</Text>}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
                />
            )}
        </View>
    );
};

// --- Mobile Dashboard Component ---
const MobileDashboard = ({ profile }: {profile: Profile}) => {
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
            onPress={() => router.push({ pathname: route, params })}
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
                <Text style={[styles.greeting, { color: colors.text }]}>Hello, {profile?.username || 'User'}</Text>
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
            </View>
        </View>
    );
};

// --- Main Component ---
export default function HomeScreen() {
  const { profile, isAdmin } = useAuth();
  const { colors } = useTheme();

  // Show the Admin Panel if the user is an admin AND they are on the web platform
  const showAdminPanel = isAdmin && Platform.OS === 'web';

  if (isAdmin && Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <AdminDashboard />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <MobileDashboard profile={profile} />
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
    },

    // Admin (Web) Styles
    adminContainer: { 
        flex: 1, 
        padding: 20,
    },
    adminTitle: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 20,
        textAlign: 'center',
    },
    adminItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 12, 
        borderWidth: 1,
    },
    adminItemDetails: { flex: 1, marginLeft: 15 },
    adminItemName: { fontSize: 16, fontWeight: 'bold' },
    adminItemType: { color: 'gray' },
    adminItemDate: { color: 'gray', marginRight: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' }
});
