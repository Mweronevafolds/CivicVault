import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Stack, useRouter } from 'expo-router';
import { getUserSubmissions } from '../api/ApiService'; // NEW: Import our fetch function

const DashboardScreen = () => {
  const router = useRouter();
  
  // NEW: State to hold live data, loading status, and errors
  const [submissions, setSubmissions] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: Function to fetch and process data from Supabase
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userSubmissions = await getUserSubmissions();
      setSubmissions(userSubmissions);

      // Calculate metrics from the fetched data
      const total = userSubmissions.length;
      const approved = userSubmissions.filter(s => s.status === 'approved').length;
      const pending = userSubmissions.filter(s => s.status === 'pending').length;
      setMetrics({ total, approved, pending });

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // NEW: useEffect hook to fetch data when the screen loads
  useEffect(() => {
    fetchData();
  }, []);

  // Helper to render the metric cards with live data
  const renderMetricCard = (title, value, iconName, color) => (
    <View style={styles.metricCard}>
      <Ionicons name={iconName} size={32} color={color} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  // Helper to render an item in the "Recent Activity" list
  const renderActivityItem = ({ item }) => {
    const isApproved = item.status === 'approved';
    return (
        <View style={styles.activityItem}>
            <View style={[styles.activityIconContainer, { backgroundColor: isApproved ? '#dcfce7' : '#fef9c3' }]}>
                <Ionicons name={isApproved ? 'checkmark-circle' : 'time'} size={24} color={isApproved ? '#22c55e' : '#f59e0b'} />
            </View>
            <View style={styles.activityDetails}>
                <Text style={styles.activityType}>{item.doc_type}</Text>
                <Text style={styles.activityDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.activityStatus, { color: isApproved ? '#22c55e' : '#f59e0b' }]}>{item.status}</Text>
        </View>
    );
  };

  // --- RENDER LOGIC ---
  if (loading && submissions.length === 0) {
    return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{marginTop: 10}}>Loading Your Dashboard...</Text>
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.center}>
            <Text>Error: {error}</Text>
            <TouchableOpacity onPress={fetchData}><Text style={{color: 'blue'}}>Try Again</Text></TouchableOpacity>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerStyle: { backgroundColor: '#fff' }, headerTintColor: '#111', title: 'My CivicVault Dashboard', headerTitleAlign: 'center', headerShadowVisible: false }} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
      >
        <View style={styles.metricsGrid}>
          {renderMetricCard('My Submissions', metrics.total, 'document-text-outline', '#2563eb')}
          {renderMetricCard('Approved', metrics.approved, 'shield-checkmark-outline', '#22c55e')}
          {renderMetricCard('Pending', metrics.pending, 'hourglass-outline', '#f59e0b')}
          {/* We'll get offline queue count from context later */}
          {renderMetricCard('Offline Queue', 0, 'cloud-offline-outline', '#6b7280')}
        </View>

        <Text style={styles.sectionTitle}>My Submission Locations</Text>
        <TouchableOpacity style={styles.mapContainer} onPress={() => router.push('/map-modal')}>
          <MapView style={styles.map} initialRegion={{ latitude: -1.29, longitude: 36.82, latitudeDelta: 0.09, longitudeDelta: 0.04 }} scrollEnabled={false} zoomEnabled={false}>
            {submissions.filter(s => s.latitude && s.longitude).map(marker => (
                <Marker key={marker.id} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} title={marker.doc_type} />
            ))}
          </MapView>
          <View style={styles.mapOverlay}><Text style={styles.mapOverlayText}>View Community Map</Text></View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
            {submissions.slice(0, 5).map(item => renderActivityItem({ item }))}
            {submissions.length === 0 && <Text style={styles.placeholderText}>No recent activity.</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES (Keep the same styles from the previous step) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  metricCard: { width: '48%', aspectRatio: 1, backgroundColor: '#fff', borderRadius: 15, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 10 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#111', marginTop: 5 },
  metricTitle: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginTop: 2 },
  mapContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  mapOverlayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  activityList: { backgroundColor: '#fff', borderRadius: 15, padding: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  activityIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  activityDetails: { flex: 1 },
  activityType: { fontSize: 16, fontWeight: '600', color: '#111' },
  activityDate: { fontSize: 13, color: '#6b7280' },
  activityStatus: { fontSize: 14, fontWeight: 'bold' },
  placeholderText: { textAlign: 'center', padding: 20, color: '#6b7280' },
});

export default DashboardScreen;
