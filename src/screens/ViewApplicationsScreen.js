import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../context/OfflineContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewApplicationsScreen = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isOnline, queue } = useOffline();

  // Mock function to fetch applications from the server
  const fetchApplications = useCallback(async () => {
    if (!isOnline) {
      setLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call to your Kotlin backend
      // const response = await fetch('YOUR_BACKEND_URL/api/applications');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = [
        { id: '1', type: 'birth', status: 'approved', date: '2025-06-15', name: 'Birth Certificate - John Doe' },
        { id: '2', type: 'id', status: 'pending', date: '2025-06-20', name: 'National ID - John Doe' },
      ];
      
      setApplications(mockData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      Alert.alert('Error', 'Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOnline]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApplications();
  }, [fetchApplications]);

  // Combine online and offline applications
  const combinedApplications = [
    ...queue.map((item, index) => ({
      id: `offline-${index}`,
      type: item.docType,
      status: 'offline',
      date: new Date(item.timestamp).toLocaleDateString(),
      name: `${item.docType === 'birth' ? 'Birth Certificate' : 'ID'} - ${item.formData?.fullName || 'Pending'}`,
      isOffline: true,
      data: item,
    })),
    ...applications,
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons 
            name={item.type === 'birth' ? 'document-text-outline' : 'id-card-outline'} 
            size={16} 
            color="#666" 
          />
          <Text style={styles.infoText}>
            {item.type === 'birth' ? 'Birth Certificate' : 'National ID'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        
        {item.isOffline && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline-outline" size={14} color="#666" />
            <Text style={styles.offlineText}>Offline - Waiting to sync</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => navigation.navigate('ApplicationDetails', { application: item })}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#2563eb" />
      </TouchableOpacity>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      case 'offline':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color="white" />
          <Text style={styles.offlineBannerText}>You are currently offline</Text>
        </View>
      )}
      
      <FlatList
        data={combinedApplications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No applications found</Text>
            <Text style={styles.emptySubtext}>
              {isOnline 
                ? 'Submit a new application to get started.'
                : 'No offline applications found.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBanner: {
    backgroundColor: '#f59e0b',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBannerText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#4b5563',
    fontSize: 14,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  offlineText: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  viewButtonText: {
    color: '#2563eb',
    fontWeight: '500',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ViewApplicationsScreen;
