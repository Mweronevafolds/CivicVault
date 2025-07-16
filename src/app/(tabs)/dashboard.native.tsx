import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserSubmissions } from '../../api/ApiService';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

type Submission = {
  id: string;
  doc_type: string;
  status: 'approved' | 'pending';
  created_at: string;
  latitude?: number;
  longitude?: number;
};

const NativeDashboard = () => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getUserSubmissions();
      setSubmissions(data);
      
      // Calculate metrics
      const total = data.length;
      const approved = data.filter(s => s.status === 'approved').length;
      const pending = total - approved;
      
      setMetrics({ total, approved, pending });
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Dashboard' }} />
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.metricValue, { color: colors.primary }]}>{metrics.total}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Total Submissions</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>{metrics.approved}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Approved</Text>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.metricValue, { color: '#F59E0B' }]}>{metrics.pending}</Text>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Pending</Text>
          </View>
        </View>

        <View style={[styles.recentActivity, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          {submissions.length > 0 ? (
            submissions.slice(0, 5).map((submission) => (
              <View key={submission.id} style={styles.activityItem}>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {submission.doc_type}
                  </Text>
                  <Text style={[styles.activityDate, { color: colors.tabIconDefault }]}>
                    {new Date(submission.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View 
                  style={[
                    styles.statusBadge, 
                    { 
                      backgroundColor: submission.status === 'approved' ? '#ECFDF5' : '#FFFBEB',
                      borderColor: submission.status === 'approved' ? '#10B981' : '#F59E0B'
                    }
                  ]}
                >
                  <Text 
                    style={[
                      styles.statusText, 
                      { 
                        color: submission.status === 'approved' ? '#10B981' : '#F59E0B',
                        textTransform: 'capitalize'
                      }
                    ]}
                  >
                    {submission.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={colors.tabIconDefault} />
              <Text style={[styles.emptyStateText, { color: colors.tabIconDefault }]}>
                No submissions yet
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.tabIconDefault }]}>
                Submit your first document to see it here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    flexWrap: 'wrap',
  },
  metricCard: {
    width: '30%',
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  recentActivity: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
});

export default NativeDashboard;
