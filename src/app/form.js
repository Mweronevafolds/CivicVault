import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RegistrationForm from '../components/RegistrationForm';

const FormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { imageUri, docType } = params;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: docType === 'birth' ? 'Birth Certificate Details' : 'ID Request Details',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <Ionicons name="close" size={28} color="#6b7280" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <RegistrationForm imageUri={imageUri} docType={docType} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
});

export default FormScreen;
