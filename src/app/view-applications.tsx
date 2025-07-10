import React, { useContext } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  useColorScheme,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';


interface SubmissionItem {
  id: string;
  type: string;
  name: string;
  status: string;
}


export default function ViewApplications() {
  const { colors } = useTheme();
  const { queue } = useOffline();
  
  const pendingSubmissions: SubmissionItem[] = queue.map((item: { timestamp: number; formData: { fullName: string } }) => ({

    id: item.timestamp.toString(),
    type: 'ID Card', // Default type since docType isn't in OfflineItem
    name: item.formData.fullName,
    status: 'Pending Sync'
  }));

  const syncedSubmissions: SubmissionItem[] = []; // Empty since submittedDocs isn't in context


  const renderItem = ({ item }: { item: SubmissionItem }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      <View style={[styles.itemIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons
          name={item.type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'}
          size={24}
          color={colors.primary}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemType, { color: colors.text }]}>{item.type}</Text>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      </View>
      <View style={[styles.statusBadge, item.status === 'Pending Sync' ? { backgroundColor: colors.error + '20', borderColor: colors.error } : { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
        <Text style={[styles.statusText, { color: item.status === 'Pending Sync' ? colors.error : colors.success }]}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={useColorScheme() === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Applications</Text>
      </View>

      <FlatList
        data={pendingSubmissions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.text + '80'} />
            <Text style={[styles.emptyText, { color: colors.text + '80' }]}>No pending applications</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {/* TODO: Add refresh logic */}}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  listContent: {
    padding: 15,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemType: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemName: {
    fontSize: 14,
    color: '#666',
  },
  itemStatus: {
    paddingHorizontal: 10,
  },
  statusBadge: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
