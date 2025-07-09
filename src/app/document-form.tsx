import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OfflineContext } from '../context/OfflineContext';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';

type DocumentType = 'birth' | 'id';

export default function DocumentForm() {
  const { docType, imageUri } = useLocalSearchParams<{ docType: DocumentType, imageUri: string }>();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    parentNames: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const offlineContext = useContext(OfflineContext);
  if (!offlineContext) throw new Error('OfflineContext not found');
  const { isOnline, addToQueue } = offlineContext;

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const documentData = {
      docType: docType || 'birth',
      imageUri: imageUri || '',
      formData,
      timestamp: new Date().getTime()
    };

    if (isOnline) {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert("Success", "Document submitted successfully!");
        router.push('/home');
      } catch (error) {
        Alert.alert("Submission Failed", "Saving offline...");
        addToQueue(documentData);
        router.push('/home');
      }
    } else {
      addToQueue(documentData);
      Alert.alert("Offline", "Document saved and will sync when online");
      router.push('/home');
    }
    setIsLoading(false);
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || !formData.dateOfBirth.trim()) {
      Alert.alert("Validation Error", "Full Name and Date of Birth are required.");
      return false;
    }
    if (docType === 'birth' && !formData.placeOfBirth.trim()) {
      Alert.alert("Validation Error", "Place of Birth is required for birth certificate.");
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Enter {docType === 'birth' ? 'Birth' : 'ID'} Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={text => setFormData({...formData, fullName: text})}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={formData.dateOfBirth}
        onChangeText={text => setFormData({...formData, dateOfBirth: text})}
      />

      {docType === 'birth' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Place of Birth"
            value={formData.placeOfBirth}
            onChangeText={text => setFormData({...formData, placeOfBirth: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Parent Names"
            value={formData.parentNames}
            onChangeText={text => setFormData({...formData, parentNames: text})}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isOnline ? 'Submit' : 'Save Offline'}
          </Text>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.light.text,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.light.icon,

    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
