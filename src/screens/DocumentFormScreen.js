import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const DocumentFormScreen = () => {
  const { docType } = useLocalSearchParams();
  const router = useRouter();

  const handleFormSubmit = () => {
    Alert.alert(
      'Success',
      `Your ${docType === 'birth' ? 'birth registration' : 'ID request'} has been submitted successfully!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {docType === 'birth' ? 'Birth Registration' : 'ID Request'}
      </Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>
          Please fill out the following information:
        </Text>
        
        {/* Form fields will go here */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleFormSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentFormScreen;
