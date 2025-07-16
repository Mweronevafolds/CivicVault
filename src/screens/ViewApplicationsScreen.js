import React from 'react';
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
import { useOffline } from '../context/OfflineContext';
import { Ionicons } from '@expo/vector-icons';


const ViewApplicationsScreen = ({ navigation }) => {
  const { queue } = useOffline();
  const { colors, isDark } = useTheme();

  // Map the offline queue to a displayable format
  const pendingSubmissions = queue.map(item => ({
    id: item.timestamp.toString(),
    type: item.docType === 'birth' ? 'Birth Certificate' : 'ID Card',
    name: item.formData.fullName,
    status: 'Pending Sync'
  }));

  // For now, no synced submissions available; can be added if needed
  const allSubmissions = [...pendingSubmissions];

  // A helper function to render each item in our lists
  const renderItem = ({ item }) => (
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
            { color: item.status === 'Submitted' ? 'green' : '#f59e0b' } // Different color for status
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

<<<<<<< Updated upstream
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

=======
      <FlatList
        data={allSubmissions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <Text style={[styles.listHeader, { color: colors.text }]}>
            Showing all submissions. Items saved offline will be synced automatically.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {/* TODO: Add refresh logic */}}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No applications found</Text>
          </View>
        }
      />
>>>>>>> Stashed changes
    </SafeAreaView>
  );
};

// --- STYLES ---
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
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flex: 1,
    marginHorizontal: 5,
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

export default ViewApplicationsScreen;
