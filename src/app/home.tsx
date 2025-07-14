import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, Platform,
  TouchableOpacity, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { HomeScreenStyles } from '../constants/Styles';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { getPendingSubmissionsForAdmin } from '../../src/api/ApiService';

type Submission = {
  id: string;
  doc_type: string;
  full_name: string;
  created_at: string;
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
        <TouchableOpacity style={HomeScreenStyles.adminItem}>
            <Ionicons 
                name={item.doc_type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'} 
                size={24} 
                color="#4b5563" 
            />
            <View style={HomeScreenStyles.adminItemDetails}>
                <Text style={HomeScreenStyles.adminItemName}>{item.full_name}</Text>
                <Text style={HomeScreenStyles.adminItemType}>{item.doc_type}</Text>
            </View>
            <Text style={HomeScreenStyles.adminItemDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>
    );

    return (
        <View style={HomeScreenStyles.adminContainer}>
            <Text style={HomeScreenStyles.adminTitle}>Pending Applications ({applications.length})</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderApplicationItem}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<Text style={HomeScreenStyles.emptyText}>No pending applications.</Text>}
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
            style={HomeScreenStyles.card} 
            onPress={() => router.push({ pathname: route, params })}
        >
          <Ionicons name={iconName} size={40} color="#2563eb" />
          <Text style={HomeScreenStyles.cardText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={HomeScreenStyles.mobileContainer}>
            <Text style={HomeScreenStyles.greeting}>Hello, {profile?.username || 'User'}</Text>
            <View style={HomeScreenStyles.cardContainer}>
                {renderDashboardCard('Register Birth', 'person-add-outline', '/camera', { type: 'birth' })}
                {renderDashboardCard('Request ID', 'id-card-outline', '/camera', { type: 'id' })}
            </View>
        </View>
    );
};

// --- Main Component with NEW Logic ---
export default function HomeScreen() {
  const { profile, isAdmin } = useAuth();

  // Case 1: If the user is an admin AND on the web, show the Admin Panel.
  if (isAdmin && Platform.OS === 'web') {
    return (
        <SafeAreaView style={HomeScreenStyles.safeArea}>
            <Stack.Screen options={{ title: 'Admin Panel', headerShown: true }} />
            <AdminDashboard />
        </SafeAreaView>
    );
  }

  // Case 2: If the platform is NOT web, show the Mobile Dashboard for everyone (admins and users).
  if (Platform.OS !== 'web') {
    return (
        <SafeAreaView style={HomeScreenStyles.safeArea}>
            <Stack.Screen options={{ title: 'Home', headerShown: false }} />
            <MobileDashboard profile={profile} />
        </SafeAreaView>
    );
  }
  
  // Case 3 (Fallback): If the user is NOT an admin AND is on the web, show an access restricted message.
  return (
        <SafeAreaView style={HomeScreenStyles.accessDeniedContainer}>

        <Stack.Screen options={{ title: 'Access Denied', headerShown: false }} />
        <Ionicons name="shield-outline" size={60} color="#ef4444" />
        <Text style={HomeScreenStyles.accessDeniedTitle}>Web Access Restricted</Text>
        <Text style={HomeScreenStyles.accessDeniedText}>
            The CivicVault web portal is for administrative use only. Please use the mobile application to manage your submissions.
        </Text>
    </SafeAreaView>
  );
};
