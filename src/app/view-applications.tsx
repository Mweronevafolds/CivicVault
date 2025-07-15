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
  useColorScheme,
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
  status: 'pending' | 'approved' | 'rejected' | 'pending sync';
  date: string;
  data: any;
}

const ViewApplications = () => {
  const theme = useTheme();
  const { queue } = useOffline();
  const [refreshing, setRefreshing] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const { user, isAdmin } = useAuth();

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
    itemWrapper: {
      marginBottom: 10,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      padding: 15,
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
    adminActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 5,
      backgroundColor: theme.colors.card,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      marginTop: -10, // Overlap with the item container
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginLeft: 10,
    },
    approveButton: {
      backgroundColor: theme.colors.success,
    },
    rejectButton: {
      backgroundColor: theme.colors.error,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

  const fetchSubmissions = useCallback(async () => {
    setRefreshing(true);
    try {
      let query = supabase.from('submissions').select('*');

      if (!isAdmin && user) {
        query = query.eq('user_id', user.id);
      }

      const { data: onlineSubs, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOnlineSubs: SubmissionItem[] = (onlineSubs || []).map((sub: any) => ({
        id: sub.id,
        type: sub.doc_type === 'birth' ? 'Birth Certificate' : 'ID Card',
        name: sub.full_name,
        status: sub.status.toLowerCase(),
        date: new Date(sub.created_at).toLocaleDateString(),
        data: sub,
      }));

      let allSubmissions = [...formattedOnlineSubs];

      if (!isAdmin) {
        const formattedOfflineSubs: SubmissionItem[] = queue.map(item => ({
          id: `offline-${item.timestamp}`,
          type: item.formData.docType === 'birth' ? 'Birth Certificate' : 'ID Card',
          name: item.formData.fullName || 'Unknown',
          status: 'pending sync' as const,
          date: new Date(item.timestamp).toLocaleDateString(),
          data: item,
        }));
        allSubmissions.push(...formattedOfflineSubs);
      }

      allSubmissions.sort(
        (a, b) =>
          new Date(b.data.created_at || b.data.timestamp).getTime() -
          new Date(a.data.created_at || a.data.timestamp).getTime()
      );

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert('Error', 'Failed to load submissions. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [user, isAdmin, queue]);

  const onRefresh = useCallback(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
    if (!isAdmin || !submissionId.toString()) return;

    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: newStatus })
        .eq('id', submissionId);

      if (error) throw error;

      // Correctly filter the submissions list to remove the acted-upon item
      setSubmissions(prevSubmissions =>
        prevSubmissions.filter(submission => submission.id !== submissionId)
      );

      Alert.alert('Success', `Application has been ${newStatus}.`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update application status.');
    }
  };

  const renderItem = ({ item }: { item: SubmissionItem }) => {
    const statusColors = {
      pending: { bg: theme.colors.primary + '20', text: theme.colors.primary, border: theme.colors.primary },
      approved: { bg: theme.colors.success + '20', text: theme.colors.success, border: theme.colors.success },
      rejected: { bg: theme.colors.error + '20', text: theme.colors.error, border: theme.colors.error },
      'pending sync': { bg: theme.colors.text + '20', text: theme.colors.text, border: theme.colors.text + '80' },
    };

    const status = statusColors[item.status] || statusColors.pending;

    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity style={styles.itemContainer}>
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
          <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
            <Text style={[styles.statusText, { color: status.text }]}>{item.status}</Text>
          </View>
        </TouchableOpacity>
        {isAdmin && item.status === 'pending' && (
          <View style={styles.adminActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleStatusChange(item.id, 'approved')}
            >
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleStatusChange(item.id, 'rejected')}
            >
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
        title={isAdmin ? 'All Applications' : 'My Applications'}
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
              {refreshing ? 'Loading...' : 'No applications found.'}
            </Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />}
      />
    </View>
  );
};

export default ViewApplications;
