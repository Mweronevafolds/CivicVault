import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OfflineContext } from '../context/OfflineContext';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../context/ThemeContext';

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
  const { colors } = useTheme();

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

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!formData.dateOfBirth.trim()) {
      errors.dateOfBirth = 'Date of Birth is required';
    }
    if (docType === 'birth' && !formData.placeOfBirth.trim()) {
      errors.placeOfBirth = 'Place of Birth is required';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      Alert.alert(
        "Validation Error", 
        "Please fill in all required fields correctly."
      );
      return false;
    }
    return true;
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        Enter {docType === 'birth' ? 'Birth' : 'ID'} Details
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input, 
            validationErrors.fullName && styles.inputError,
            { 
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.inputText
            }
          ]}
          placeholder="Full Name *"
          placeholderTextColor="#888"
          value={formData.fullName}
          onChangeText={text => {
            setFormData({...formData, fullName: text});
            if (validationErrors.fullName) {
              setValidationErrors(prev => ({...prev, fullName: ''}));
            }
          }}
        />
        {validationErrors.fullName && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {validationErrors.fullName}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input, 
            validationErrors.dateOfBirth && styles.inputError,
            { 
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.inputText
            }
          ]}
          placeholder="Date of Birth (YYYY-MM-DD) *"
          placeholderTextColor="#888"
          value={formData.dateOfBirth}
          onChangeText={text => {
            setFormData({...formData, dateOfBirth: text});
            if (validationErrors.dateOfBirth) {
              setValidationErrors(prev => ({...prev, dateOfBirth: ''}));
            }
          }}
        />
        {validationErrors.dateOfBirth && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {validationErrors.dateOfBirth}
          </Text>
        )}
      </View>

      {docType === 'birth' && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                validationErrors.placeOfBirth && styles.inputError,
                { 
                  borderColor: colors.border,
                  backgroundColor: colors.inputBackground,
                  color: colors.inputText
                }
              ]}
              placeholder="Place of Birth *"
              placeholderTextColor="#888"
              value={formData.placeOfBirth}
              onChangeText={text => {
                setFormData({...formData, placeOfBirth: text});
                if (validationErrors.placeOfBirth) {
                  setValidationErrors(prev => ({...prev, placeOfBirth: ''}));
                }
              }}
            />
            {validationErrors.placeOfBirth && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {validationErrors.placeOfBirth}
              </Text>
            )}
          </View>

          <TextInput
            style={[
              styles.input,
              { 
                borderColor: colors.border,
                backgroundColor: colors.inputBackground,
                color: colors.inputText
              }
            ]}
            placeholder="Parent Names"
            placeholderTextColor="#888"
            value={formData.parentNames}
            onChangeText={text => setFormData({...formData, parentNames: text})}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>
            {isOnline ? 'Submit' : 'Save Offline'}
          </Text>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
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
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  submitButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
