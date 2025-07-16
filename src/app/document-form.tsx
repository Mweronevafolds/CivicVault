import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { Colors } from '../constants/Colors';
import { OfflineContext } from '../context/OfflineContext';
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
        <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Enter {docType === 'birth' ? 'Birth' : 'ID'} Details</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, validationErrors.fullName && styles.inputError]}
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
          <Text style={styles.errorText}>{validationErrors.fullName}</Text>
        )}
      </View>



      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, validationErrors.dateOfBirth && styles.inputError]}
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
          <Text style={styles.errorText}>{validationErrors.dateOfBirth}</Text>
        )}
      </View>



      {docType === 'birth' && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, validationErrors.placeOfBirth && styles.inputError]}
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
              <Text style={styles.errorText}>{validationErrors.placeOfBirth}</Text>
            )}
          </View>


          <TextInput
            style={styles.input}
            placeholder="Parent Names"
            placeholderTextColor="#888"
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
  inputContainer: {
    marginBottom: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
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
