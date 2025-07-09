import React, { useContext } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../context/OfflineContext';


interface SubmissionItem {
  id: string;
  type: string;
  name: string;
  status: string;
}


export default function ViewApplications() {
  const { queue } = useOffline();
  
  const pendingSubmissions: SubmissionItem[] = queue.map((item: { timestamp: number; formData: { fullName: string } }) => ({

    id: item.timestamp.toString(),
    type: 'ID Card', // Default type since docType isn't in OfflineItem
    name: item.formData.fullName,
    status: 'Pending Sync'
  }));

  const syncedSubmissions: SubmissionItem[] = []; // Empty since submittedDocs isn't in context


  const renderItem = ({ item }: { item: SubmissionItem }) => (

    <View style={styles.itemContainer}>
      <View style={styles.itemIcon}>
        <Ionicons
          name={item.type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'}
          size={24}
          color="#2563eb"
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemType}>{item.type}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
      <View style={styles.itemStatus}>
        <Text style={[
            styles.statusText,
            { color: item.status === 'Submitted' ? 'green' : '#f59e0b' }
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

      <FlatList
        data={[...pendingSubmissions, ...syncedSubmissions]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            Showing all submissions. Items saved offline will be synced automatically.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {/* TODO: Add refresh logic */}}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No applications found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  listContainer: {
    padding: 20,
  },
  listHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemIcon: {
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemName: {
    fontSize: 14,
    color: '#666',
  },
  itemStatus: {
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
