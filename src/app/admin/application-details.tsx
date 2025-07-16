import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Alert, ActivityIndicator, Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { getSubmissionById, updateSubmissionStatus } from '../../api/ApiService';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Submission = {
  id: string;
  doc_type: string;
  full_name: string;
  date_of_birth?: string;
  place_of_birth?: string;
  parent_names?: string;
  id_number?: string;
  image_url: string;
  status: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
};

export default function AdminApplicationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      getSubmissionById(id as string)
        .then(setSubmission)
        .catch(err => Alert.alert('Error', (err as Error).message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (!submission) return;
    setIsUpdating(true);
    try {
      await updateSubmissionStatus(submission.id, status);
      Alert.alert('Success', `Application has been ${status}.`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!submission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Application not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Review Application', 
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{submission.full_name}</Text>
          <Text style={styles.subtitle}>{submission.doc_type}</Text>
          <Text style={styles.date}>{new Date(submission.created_at).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{submission.full_name}</Text>
          </View>
          {submission.date_of_birth && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{submission.date_of_birth}</Text>
            </View>
          )}
          {submission.place_of_birth && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Place of Birth:</Text>
              <Text style={styles.value}>{submission.place_of_birth}</Text>
            </View>
          )}
          {submission.parent_names && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Parent Names:</Text>
              <Text style={styles.value}>{submission.parent_names}</Text>
            </View>
          )}
          {submission.id_number && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>ID Number:</Text>
              <Text style={styles.value}>{submission.id_number}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document</Text>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: submission.image_url }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, styles[submission.status]]}>
              {submission.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleUpdateStatus('approved')}
            disabled={isUpdating}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleUpdateStatus('rejected')}
            disabled={isUpdating}
          >
            <Ionicons name="close-circle-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusText: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: '600',
  },
  approved: {
    backgroundColor: '#dcfce7',
    color: '#10b981',
  },
  rejected: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  pending: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    fontSize: 16,
    marginTop: 20,
  },
});
