import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import FormInput from './FormInput';
import { supabase } from '../config/client';
import { uploadImage, createSubmission } from '../api/ApiService';

const RegistrationForm = ({ imageUri, docType }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: new Date(),
    placeOfBirth: '',
    parentNames: '',
    idNumber: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData(prev => ({ ...prev, dateOfBirth: currentDate }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim() || !formData.dateOfBirth) {
      return Alert.alert('Missing Information', 'Please fill out all required fields.');
    }

    setIsLoading(true);
    try {
      // Upload the image first
      const imageUrl = await uploadImage(imageUri);
      
      // Prepare the submission data (without user_id)
      const submissionData = {
        doc_type: docType === 'birth' ? 'Birth Certificate' : 'ID Card',
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth.toISOString().split('T')[0],
        place_of_birth: formData.placeOfBirth || null,
        parent_names: formData.parentNames || null,
        id_number: formData.idNumber || null,
        image_url: imageUrl,
        status: 'pending',
      };
      
      // Create the submission (ApiService will handle adding the user_id)
      await createSubmission(submissionData);
      
      Alert.alert(
        'Submission Successful',
        'Your application has been received and is now pending review.',
        [{ text: 'OK', onPress: () => router.replace('/home') }]
      );
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Submission Failed', error.message || 'An error occurred while submitting your application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='always'
      >
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <Text style={styles.imageLabel}>Attached Document</Text>
        </View>

        <Text style={styles.sectionTitle}>Personal Details</Text>
        <FormInput
          label="Full Name"
          iconName="person-outline"
          placeholder="Enter full name"
          value={formData.fullName}
          onChangeText={value => handleInputChange('fullName', value)}
        />
        
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#6b7280" style={{marginRight: 10}}/>
            <Text style={styles.datePickerText}>{formData.dateOfBirth.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                value={formData.dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}

        {docType === 'birth' ? (
          <>
            <Text style={styles.sectionTitle}>Birth Information</Text>
            <FormInput label="Place of Birth" iconName="location-outline" placeholder="e.g., Nairobi Hospital" value={formData.placeOfBirth} onChangeText={value => handleInputChange('placeOfBirth', value)} />
            <FormInput label="Parent(s) Full Names" iconName="people-outline" placeholder="Enter names of parents" value={formData.parentNames} onChangeText={value => handleInputChange('parentNames', value)} />
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>ID Information</Text>
            <FormInput label="ID Number" iconName="id-card-outline" placeholder="Enter National ID Number" value={formData.idNumber} onChangeText={value => handleInputChange('idNumber', value)} keyboardType="numeric" />
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Application</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  imagePreviewContainer: { alignItems: 'center', marginBottom: 20 },
  imagePreview: { width: 120, height: 120, borderRadius: 10, borderWidth: 2, borderColor: '#e5e7eb' },
  imageLabel: { marginTop: 8, fontSize: 12, color: '#6b7280' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 10, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 5 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  datePickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 10, paddingVertical: 12, marginBottom: 20 },
  datePickerText: { fontSize: 16, color: '#111827' },
  submitButton: { backgroundColor: '#2563eb', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RegistrationForm;
