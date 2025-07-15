import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAllSubmissionsForAdmin, getUserSubmissions } from '../api/ApiService'; // Import the new function
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const DashboardScreen = ({ isAdmin }) => {
  const router = useRouter();
  const { colors } = useTheme(); // Get theme colors
  const styles = getStyles(colors); // Create styles with theme colors
  
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
      // Conditionally fetch data based on the user's role
      const userSubmissions = isAdmin ? await getAllSubmissionsForAdmin() : await getUserSubmissions();
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

  // Re-fetch data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

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
    const statusColor = isApproved ? colors.success : colors.warning;
    const statusBgColor = isApproved ? colors.successSoft : colors.warningSoft;

    return (
        <View style={styles.activityItem}>
            <View style={[styles.activityIconContainer, { backgroundColor: statusBgColor }]}>
                <Ionicons name={isApproved ? 'checkmark-circle' : 'time'} size={24} color={statusColor} />
            </View>
            <View style={styles.activityDetails}>
                <Text style={styles.activityType}>{item.doc_type}</Text>
                <Text style={styles.activityDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.activityStatus, { color: statusColor }]}>{item.status}</Text>
        </View>
    );
  };

  // --- RENDER LOGIC ---
  if (loading && submissions.length === 0) {
    return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{marginTop: 10, color: colors.text}}>Loading Your Dashboard...</Text>
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.center}>
            <Text style={{color: colors.text}}>Error: {error}</Text>
            <TouchableOpacity onPress={fetchData}><Text style={{color: colors.primary}}>Try Again</Text></TouchableOpacity>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* The header is managed by the navigator, so we remove this Stack.Screen */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
      >
        <View style={styles.metricsGrid}>
          {renderMetricCard(isAdmin ? 'Total Submissions' : 'My Submissions', metrics.total, 'document-text-outline', colors.primary)}
          {renderMetricCard('Approved', metrics.approved, 'shield-checkmark-outline', colors.success)}
          {renderMetricCard('Pending', metrics.pending, 'hourglass-outline', colors.warning)}
          {renderMetricCard('Offline Queue', 0, 'cloud-offline-outline', colors.textSecondary)}
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

// --- STYLES --- 
const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  scrollContainer: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 15, marginTop: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  metricCard: { width: '48%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: 15, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 5 },
  metricTitle: { fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginTop: 2 },
  mapContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  mapOverlayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  activityList: { backgroundColor: colors.card, borderRadius: 15, padding: 10, borderWidth: 1, borderColor: colors.border },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border },
  activityIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  activityDetails: { flex: 1 },
  activityType: { fontSize: 16, fontWeight: '600', color: colors.text },
  activityDate: { fontSize: 13, color: colors.textSecondary },
  activityStatus: { fontSize: 14, fontWeight: 'bold' },
  placeholderText: { textAlign: 'center', padding: 20, color: colors.textSecondary },
});

export default DashboardScreen;
