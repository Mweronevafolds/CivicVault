import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import ModernAppBar from '../components/ModernAppBar';
import { supabase } from '../config/client';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useTheme } from '../context/ThemeContext';


interface SubmissionItem {
  id: string;
  type: 'Birth Certificate' | 'ID Card';
  name: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Pending Sync';
  date: string;
  data: any;
}

const ViewApplications = () => {
  const theme = useTheme();
  const { queue } = useOffline();
  const [refreshing, setRefreshing] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const { user } = useAuth();
  
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
      textAlign: 'center',
    },
    listContent: {
      padding: 15,
      paddingTop: 60,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      backgroundColor: theme.colors.card,
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
      backgroundColor: theme.colors.primary + '20',
    },
    itemDetails: {
      flex: 1,
    },
    itemType: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
    },
    itemName: {
      fontSize: 14,
      color: theme.colors.text + 'CC',
      marginVertical: 2,
    },
    itemDate: {
      fontSize: 12,
      color: theme.colors.text + '99',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
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

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch online submissions from Supabase
      const { data: onlineSubs, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format online submissions
      const formattedOnlineSubs: SubmissionItem[] = (onlineSubs || []).map((sub: any) => ({
        id: sub.id,
        type: sub.doc_type === 'birth' ? 'Birth Certificate' : 'ID Card',
        name: sub.full_name,
        status: sub.status || 'Pending',
        date: new Date(sub.created_at).toLocaleDateString(),
        data: sub
      }));

      // Format offline submissions
      const formattedOfflineSubs: SubmissionItem[] = queue.map(item => ({
        id: `offline-${item.timestamp}`,
        type: (item as any).docType === 'birth' ? 'Birth Certificate' : 'ID Card',
        name: item.formData.fullName || 'Unknown',
        status: 'Pending Sync' as const,
        date: new Date(item.timestamp).toLocaleDateString(),
        data: item
      }));

      // Combine and sort by date (newest first)
      const allSubmissions = [...formattedOnlineSubs, ...formattedOfflineSubs].sort(
        (a, b) => new Date(b.data.created_at || b.data.timestamp).getTime() - 
                  new Date(a.data.created_at || a.data.timestamp).getTime()
      );

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert('Error', 'Failed to load submissions. Please try again.');
    }
  }, [user, queue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSubmissions();
    setRefreshing(false);
  }, [fetchSubmissions]);

  // Initial fetch
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);


  const renderItem = ({ item }: { item: SubmissionItem }) => {
    const statusColors = {
      'Pending': { bg: theme.colors.primary + '20', text: theme.colors.primary, border: theme.colors.primary },
      'Approved': { bg: theme.colors.success + '20', text: theme.colors.success, border: theme.colors.success },
      'Rejected': { bg: theme.colors.error + '20', text: theme.colors.error, border: theme.colors.error },
      'Pending Sync': { bg: theme.colors.text + '20', text: theme.colors.text, border: theme.colors.text + '80' },
    };

    const status = statusColors[item.status] || statusColors.Pending;

    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => {
          // Navigate to details screen if needed
          // router.push({ pathname: '/application-details', params: { id: item.id } });
        }}
      >
        <View style={[styles.itemIcon, { backgroundColor: status.bg }]}>
          <Ionicons
            name={item.type === 'Birth Certificate' ? 'person-add-outline' : 'id-card-outline'}
            size={20}
            color={status.text}
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemType}>{item.type}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { 
          backgroundColor: status.bg,
          borderColor: status.border
        }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        data={submissions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={theme.colors.text + '80'} />
            <Text style={styles.emptyText}>
              {refreshing ? 'Loading...' : 'No applications found. Submit a new application to get started.'}
            </Text>
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
