import React, { useCallback, useState } from 'react';
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
import type { OfflineItem } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';
import ModernAppBar from '../components/ModernAppBar';


interface SubmissionItem {
  id: string;
  type: string;
  name: string;
  status: string;
}


const ViewApplications = () => {
  const theme = useTheme();
  const { queue } = useOffline();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      color: theme.colors.text + '80',
    },
    listContent: {
      padding: 15,
      paddingTop: 60, // Add padding to account for the floating back button
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
      color: theme.colors.text + 'CC',
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
      fontFamily: 'System',
    },
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh since refreshSubmissions might not be available
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);
  
  const pendingSubmissions: SubmissionItem[] = queue.map((item: { timestamp: number; formData: { fullName: string } }) => ({
    id: item.timestamp.toString(),
    type: 'ID Card', // Default type since docType isn't in OfflineItem
    name: item.formData?.fullName || 'Unknown',
    status: 'Pending Sync'
  }));

  const syncedSubmissions: SubmissionItem[] = []; // Empty since submittedDocs isn't in context


  const renderItem = ({ item }: { item: SubmissionItem }) => (
    <View style={[styles.itemContainer, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.itemIcon, { backgroundColor: theme.colors.primary + '20' }]}>
        <Ionicons
          name={item.type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'}
          size={24}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemType, { color: theme.colors.text }]}>{item.type}</Text>
        <Text style={[styles.itemName, { color: theme.colors.text }]}>{item.name}</Text>
      </View>
      <View style={[styles.statusBadge, item.status === 'Pending Sync' ? 
        { backgroundColor: theme.colors.error + '20', borderColor: theme.colors.error } : 
        { backgroundColor: theme.colors.success + '20', borderColor: theme.colors.success }]}
      >
        <Text style={[styles.statusText, { 
          color: item.status === 'Pending Sync' ? theme.colors.error : theme.colors.success 
        }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={useColorScheme() === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <ModernAppBar 
        title="My Applications" 
        onBack={() => router.back()}
        elevation={2}
      />

      <FlatList
        data={pendingSubmissions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={theme.colors.text + '80'} />
            <Text style={styles.emptyText}>No pending applications</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

export default ViewApplications;
