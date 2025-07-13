import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, Platform,
  TouchableOpacity, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { getPendingSubmissionsForAdmin } from '../../src/api/ApiService';

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
    const renderDashboardCard = (
      title: string, 
      iconName: 'person-add-outline' | 'id-card-outline',
      route: '/camera',
      params: { type: 'birth' | 'id' }
    ) => (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({ pathname: route, params })}
        >
          <Ionicons name={iconName} size={40} color="#2563eb" />
          <Text style={styles.cardText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mobileContainer}>
            <Text style={styles.greeting}>Hello, {profile?.username || 'User'}</Text>
            <View style={styles.cardContainer}>
                {renderDashboardCard('Register Birth', 'person-add-outline', '/camera', { type: 'birth' })}
                {renderDashboardCard('Request ID', 'id-card-outline', '/camera', { type: 'id' })}
            </View>
        </View>
    );
};

// --- Main Component ---
export default function HomeScreen() {
  const { profile, isAdmin } = useAuth();

  // Show the Admin Panel if the user is an admin AND they are on the web platform
  const showAdminPanel = isAdmin && Platform.OS === 'web';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      {showAdminPanel ? <AdminDashboard /> : <MobileDashboard profile={profile} />}
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
    // Mobile Styles
    mobileContainer: { flex: 1, padding: 20 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 20 },
    cardContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    card: { width: '45%', aspectRatio: 1, backgroundColor: '#f0f4f8', borderRadius: 15, padding: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
    cardText: { marginTop: 10, color: '#2563eb', fontWeight: '600', textAlign: 'center', fontSize: 16 },

    // Admin (Web) Styles
    adminContainer: { flex: 1, padding: Platform.OS === 'web' ? 40 : 20, backgroundColor: '#f8f9fa' },
    adminTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#111827' },
    adminItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e5e7eb' },
    adminItemDetails: { flex: 1, marginLeft: 15 },
    adminItemName: { fontSize: 16, fontWeight: 'bold' },
    adminItemType: { color: 'gray' },
    adminItemDate: { color: 'gray', marginRight: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' }
});
