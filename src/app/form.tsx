import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../src/config/client';
import * as ImagePicker from 'expo-image-picker';

const FormScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    place_of_birth: '',
    parent_names: '',
    id_number: '',
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    if (params.imageUri) {
      setImageUri(params.imageUri as string);
    }
    if (params.docType) {
      setDocType(params.docType as string);
    }
    if (params.latitude) {
      setLatitude(Number(params.latitude));
    }
    if (params.longitude) {
      setLongitude(Number(params.longitude));
    }
    if (params.accuracy) {
      setAccuracy(Number(params.accuracy));
    }
    if (params.timestamp) {
      setTimestamp(Number(params.timestamp));
    }
  }, [params]);

  const handleSubmit = async () => {
    try {
      if (!imageUri) {
        alert('Please select an image first');
        return;
      }

      // Upload image to Supabase storage
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const { data: { publicUrl }, error: uploadError } = await supabase.storage
        .from('registrations')
        .upload(filename, await fetch(imageUri).then(res => res.blob()), {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Insert into submissions table
      const { error } = await supabase
        .from('submissions')
        .insert({
          doc_type: docType,
          full_name: formData.full_name,
          date_of_birth: formData.date_of_birth,
          place_of_birth: formData.place_of_birth,
          parent_names: formData.parent_names,
          id_number: formData.id_number,
          image_url: publicUrl,
          latitude: latitude,
          longitude: longitude,
          accuracy: accuracy,
          timestamp: timestamp
        });

      if (error) throw error;

      alert('Registration successful!');
      router.replace('/home');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
      </View>

      <Text style={styles.title}>Registration Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.full_name}
        onChangeText={(text) => setFormData({ ...formData, full_name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={formData.date_of_birth}
        onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Place of Birth"
        value={formData.place_of_birth}
        onChangeText={(text) => setFormData({ ...formData, place_of_birth: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Parent Names"
        value={formData.parent_names}
        onChangeText={(text) => setFormData({ ...formData, parent_names: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="ID Number"
        value={formData.id_number}
        onChangeText={(text) => setFormData({ ...formData, id_number: text })}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormScreen;
