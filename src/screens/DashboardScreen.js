import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Stack } from 'expo-router';

// --- NEW: Personalized Mock Data for "Abdi" ---
// This data represents what would be fetched from the backend for the logged-in user.
const userDashboardData = {
  totalSubmissions: 7,
  pendingSubmissions: 2,
  approvedSubmissions: 5,
  offlineQueue: 1, // Items waiting to sync
};

// User's recent activities
const recentActivity = [
  { id: '1', type: 'ID Request', status: 'Approved', date: '2025-07-08' },
  { id: '2', type: 'Birth Certificate', status: 'Pending', date: '2025-07-05' },
  { id: '3', type: 'ID Request', status: 'Pending', date: '2025-07-02' },
  { id: '4', type: 'Birth Certificate', status: 'Approved', date: '2025-06-28' },
];

// Locations of the user's submissions
const userSubmissionLocations = [
    { id: '1', lat: -1.286389, lon: 36.817223, title: 'ID Request - Approved' },
    { id: '2', lat: -1.292066, lon: 36.821945, title: 'Birth Cert - Pending' },
];

const DashboardScreen = () => {
  // Helper to render the new personalized metric cards
  const renderMetricCard = (title, value, iconName, color) => (
    <View style={styles.metricCard}>
      <Ionicons name={iconName} size={32} color={color} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  // Helper to render an item in the "Recent Activity" list
  const renderActivityItem = ({ item }) => {
    const isApproved = item.status === 'Approved';
    return (
        <View style={styles.activityItem}>
            <View style={[styles.activityIconContainer, { backgroundColor: isApproved ? '#dcfce7' : '#fef9c3' }]}>
                <Ionicons name={isApproved ? 'checkmark-circle' : 'time'} size={24} color={isApproved ? '#22c55e' : '#f59e0b'} />
            </View>
            <View style={styles.activityDetails}>
                <Text style={styles.activityType}>{item.type}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
            </View>
            <Text style={[styles.activityStatus, { color: isApproved ? '#22c55e' : '#f59e0b' }]}>{item.status}</Text>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NEW: Updated header title */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#111',
          title: 'My CivicVault Dashboard',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.metricsGrid}>
          {renderMetricCard('My Submissions', userDashboardData.totalSubmissions, 'document-text-outline', '#2563eb')}
          {renderMetricCard('Approved', userDashboardData.approvedSubmissions, 'shield-checkmark-outline', '#22c55e')}
          {renderMetricCard('Pending', userDashboardData.pendingSubmissions, 'hourglass-outline', '#f59e0b')}
          {renderMetricCard('Offline Queue', userDashboardData.offlineQueue, 'cloud-offline-outline', '#6b7280')}
        </View>

        <Text style={styles.sectionTitle}>My Submission Locations</Text>
        <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={{ latitude: -1.29, longitude: 36.82, latitudeDelta: 0.09, longitudeDelta: 0.04 }}>
                {userSubmissionLocations.map(marker => (
                    <Marker key={marker.id} coordinate={{ latitude: marker.lat, longitude: marker.lon }} title={marker.title} />
                ))}
            </MapView>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
            {recentActivity.map(item => renderActivityItem({ item }))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- NEW STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Lighter background
  },
  scrollContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricCard: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 5,
  },
  metricTitle: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 2,
  },
  mapContainer: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityDetails: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  activityDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
