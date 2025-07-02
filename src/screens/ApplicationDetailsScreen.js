import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const ApplicationDetailsScreen = ({ route, navigation }) => {
  const { application } = route.params;
  const isOffline = application.isOffline || false;

  const getStatusDetails = () => {
    switch (application.status) {
      case 'approved':
        return {
          icon: 'checkmark-circle',
          color: '#10b981',
          message: 'Your application has been approved.',
        };
      case 'rejected':
        return {
          icon: 'close-circle',
          color: '#ef4444',
          message: 'Your application has been rejected.',
        };
      case 'pending':
        return {
          icon: 'time',
          color: '#f59e0b',
          message: 'Your application is being processed.',
        };
      case 'offline':
        return {
          icon: 'cloud-offline',
          color: '#6b7280',
          message: 'This application is queued for submission.',
        };
      default:
        return {
          icon: 'help-circle',
          color: '#6b7280',
          message: 'Status unknown.',
        };
    }
  };

  const status = getStatusDetails();

  const handleViewDocument = async () => {
    if (application.imageUri) {
      try {
        // Check if the file exists
        const fileInfo = await FileSystem.getInfoAsync(application.imageUri);
        
        if (fileInfo.exists) {
          // For demo purposes, we'll just show an alert
          // In a real app, you might want to open the image in a full-screen viewer
          Alert.alert(
            'Document Image',
            'This would open the document in a full-screen viewer in the final app.'
          );
        } else {
          Alert.alert('Error', 'The document image could not be found.');
        }
      } catch (error) {
        console.error('Error accessing document:', error);
        Alert.alert('Error', 'Could not open the document.');
      }
    } else if (application.data?.imageUri) {
      // Handle case where the image is in the data object (from offline queue)
      try {
        const fileInfo = await FileSystem.getInfoAsync(application.data.imageUri);
        
        if (fileInfo.exists) {
          Alert.alert(
            'Document Image',
            'This would open the document in a full-screen viewer in the final app.'
          );
        } else {
          Alert.alert('Error', 'The document image could not be found.');
        }
      } catch (error) {
        console.error('Error accessing document:', error);
        Alert.alert('Error', 'Could not open the document.');
      }
    } else {
      Alert.alert('No Document', 'No document is associated with this application.');
    }
  };

  const renderField = (label, value, icon) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={18} color="#6b7280" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <Text style={styles.fieldValue}>
        {value || 'Not provided'}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {application.type === 'birth' ? 'Birth Certificate' : 'National ID'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Ionicons name={status.icon} size={16} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {application.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>
          Submitted on {new Date(application.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Application Details</Text>
        
        {isOffline ? (
          <>
            {application.data?.formData?.fullName && 
              renderField('Full Name', application.data.formData.fullName, 'person-outline')}
            
            {application.data?.formData?.dateOfBirth && 
              renderField('Date of Birth', application.data.formData.dateOfBirth, 'calendar-outline')}
            
            {application.type === 'birth' && application.data?.formData?.placeOfBirth && 
              renderField('Place of Birth', application.data.formData.placeOfBirth, 'location-outline')}
            
            {application.type === 'birth' && application.data?.formData?.parentNames && 
              renderField("Parents' Names", application.data.formData.parentNames, 'people-outline')}
            
            {application.type === 'id' && application.data?.formData?.address && 
              renderField('Address', application.data.formData.address, 'home-outline')}
          </>
        ) : (
          // This would be populated from the API response in a real app
          <>
            {renderField('Applicant', application.name, 'person-outline')}
            {renderField('Application ID', application.id, 'document-text-outline')}
            {renderField('Type', application.type === 'birth' ? 'Birth Certificate' : 'National ID', 'document-outline')}
            {renderField('Status', application.status, 'information-circle-outline')}
          </>
        )}

        <TouchableOpacity style={styles.documentButton} onPress={handleViewDocument}>
          <Ionicons 
            name="document-attach-outline" 
            size={20} 
            color="#2563eb" 
          />
          <Text style={styles.documentButtonText}>
            {isOffline ? 'View Captured Document' : 'View Application Document'}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color="#9ca3af" 
            style={{ marginLeft: 'auto' }} 
          />
        </TouchableOpacity>
      </View>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color="#fff" />
          <Text style={styles.offlineText}>
            This application is queued and will be submitted when you're back online.
          </Text>
        </View>
      )}

      <View style={styles.helpCard}>
        <Ionicons name="help-circle-outline" size={24} color="#2563eb" />
        <View style={styles.helpContent}>
          <Text style={styles.helpTitle}>Need help with your application?</Text>
          <Text style={styles.helpText}>
            Contact our support team if you have any questions about your application status.
          </Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Linking.openURL('mailto:support@civicvault.example.com')}
          >
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 24,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 16,
  },
  documentButtonText: {
    color: '#2563eb',
    marginLeft: 12,
    fontWeight: '500',
  },
  offlineBanner: {
    backgroundColor: '#f59e0b',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    marginLeft: 8,
    flex: 1,
  },
  helpCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  helpContent: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 8,
  },
  helpButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  helpButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ApplicationDetailsScreen;
