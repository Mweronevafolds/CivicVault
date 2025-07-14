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
import { getUserSubmissions } from '../../api/ApiService';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

const DashboardScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  type Submission = {
    id: string;
    doc_type: string;
    status: 'approved' | 'pending';
    created_at: string;
    latitude?: number;
    longitude?: number;
  };

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, approved: 0, pending: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userSubmissions = await getUserSubmissions();
      setSubmissions(userSubmissions);

      const total = userSubmissions.length;
      const approved = userSubmissions.filter(s => s.status === 'approved').length;
      const pending = userSubmissions.filter(s => s.status === 'pending').length;
      setMetrics({ total, approved, pending });

    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error occurred');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderMetricCard = (
    title: string, 
    value: number, 
    iconName: string, 
    color: string
  ) => (

    <View style={[
      styles.metricCard,
      { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }
    ]}>
      <Ionicons name={iconName as any} size={32} color={color} />

      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metricTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );

  const renderActivityItem = ({ item }: { item: Submission }) => {

    const isApproved = item.status === 'approved';
    const statusColor = isApproved ? '#10b981' : '#f59e0b'; // Success and warning colors
    return (
        <View style={[
          styles.activityItem,
          { borderBottomColor: colors.border }
        ]}>
            <View style={[
              styles.activityIconContainer,
              { backgroundColor: isApproved ? '#dcfce7' : '#fef9c3' }
            ]}>
                <Ionicons 
                  name={isApproved ? 'checkmark-circle' : 'time'} 
                  size={24} 
                  color={statusColor} 
                />
            </View>
            <View style={styles.activityDetails}>
                <Text style={[styles.activityType, { color: colors.text }]}>{item.doc_type}</Text>
                <Text style={[styles.activityDate, { color: colors.text }]}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.activityStatus, { color: statusColor }]}>{item.status}</Text>
        </View>
    );
  };

  if (loading && submissions.length === 0) {
    return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading Your Dashboard...</Text>
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.center}>
            <Text style={{ color: '#ef4444' }}>Error: {error}</Text>
            <TouchableOpacity onPress={fetchData}>
              <Text style={{color: colors.primary}}>Try Again</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        title: 'My CivicVault Dashboard', 
        headerTitleAlign: 'center', 
        headerShadowVisible: false 
      }} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={fetchData}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.metricsGrid}>
          {renderMetricCard('My Submissions', metrics.total, 'document-text-outline', colors.primary)}
          {renderMetricCard('Approved', metrics.approved, 'shield-checkmark-outline', '#10b981')}
          {renderMetricCard('Pending', metrics.pending, 'hourglass-outline', '#f59e0b')}
          {renderMetricCard('Offline Queue', 0, 'cloud-offline-outline', colors.text)}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>My Submission Locations</Text>
        <TouchableOpacity style={styles.mapContainer} onPress={() => router.push('/map-modal')}>
          <MapView style={styles.map} initialRegion={{ latitude: -1.29, longitude: 36.82, latitudeDelta: 0.09, longitudeDelta: 0.04 }} scrollEnabled={false} zoomEnabled={false}>
            {submissions
              .filter((s): s is Submission & { latitude: number; longitude: number } => 
                !!s.latitude && !!s.longitude
              )
              .map(marker => (

                <Marker 
                  key={marker.id} 
                  coordinate={{ 
                    latitude: marker.latitude, 
                    longitude: marker.longitude 
                  }} 
                  title={marker.doc_type} 
                />

            ))}
          </MapView>
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>View Community Map</Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        <View style={[
          styles.activityList,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }
        ]}>
            {submissions.slice(0, 5).map(item => renderActivityItem({ item }))}
            {submissions.length === 0 && (
              <Text style={[styles.placeholderText, { color: colors.text }]}>
                No recent activity.
              </Text>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  metricCard: { width: '48%', aspectRatio: 1, borderRadius: 15, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginBottom: 10 },
  metricValue: { fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  metricTitle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  mapContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 20, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  mapOverlayText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  activityList: { borderRadius: 15, padding: 10, borderWidth: 1 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1 },
  activityIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  activityDetails: { flex: 1 },
  activityType: { fontSize: 16, fontWeight: '600' },
  activityDate: { fontSize: 13 },
  activityStatus: { fontSize: 14, fontWeight: 'bold' },
  placeholderText: { textAlign: 'center', padding: 20 },
  loadingText: { marginTop: 10 }
});

export default DashboardScreen;
