import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, TextInput, ScrollView, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { OfflineContext } from '../context/OfflineContext';

export default function CameraScreen({ navigation, route }) {
  const { docType } = route.params; // 'birth' or 'id'
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: camera, 2: preview, 3: form
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    parentNames: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOnline, addToQueue } = useContext(OfflineContext);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Reset state when docType changes or screen is entered
    setCurrentStep(1);
    setCapturedImage(null);
    setFormData({
      fullName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      parentNames: '',
    });
  }, [docType]);

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        const processedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setCapturedImage(processedImage.uri);
        setCurrentStep(2);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else if (currentStep === 2) {
      setCapturedImage(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter full name');
      return false;
    }
    if (!formData.dateOfBirth.trim()) {
      Alert.alert('Validation Error', 'Please enter date of birth');
      return false;
    }
    return true;
  };

  const submitDocument = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const documentData = {
      docType,
      imageUri: capturedImage,
      formData,
      timestamp: new Date().toISOString(),
    };

    if (isOnline) {
      try {
        // Replace with real API call to Kotlin backend here
        // For now, simulate success
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Success', 'Document submitted successfully');
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error', 'Submission failed. Saving offline.');
        addToQueue(documentData);
        navigation.navigate('Home');
      }
    } else {
      addToQueue(documentData);
      Alert.alert('Offline', 'Document saved offline. Will sync when online.');
      navigation.navigate('Home');
    }
    setIsSubmitting(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  if (currentStep === 1) {
    // Camera view
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Capture {docType === 'birth' ? 'Birth Certificate' : 'ID'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef} />
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color="#2563eb" />
            ) : (
              <Ionicons name="camera" size={40} color="#2563eb" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (currentStep === 2) {
    // Preview step
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Photo</Text>
          <View style={{ width: 24 }} />
        </View>
        <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        <View style={styles.previewButtons}>
          <TouchableOpacity
            style={styles.usePhotoButton}
            onPress={() => setCurrentStep(3)}
          >
            <Text style={styles.usePhotoButtonText}>Use Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setCapturedImage(null);
              setCurrentStep(1);
            }}
          >
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (currentStep === 3) {
    // Form step
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {docType === 'birth' ? 'Birth Certificate' : 'ID'} Details
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Image source={{ uri: capturedImage }} style={styles.formImage} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={text => setFormData({ ...formData, fullName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={formData.dateOfBirth}
            onChangeText={text => setFormData({ ...formData, dateOfBirth: text })}
          />
          {docType === 'birth' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Place of Birth"
                value={formData.placeOfBirth}
                onChangeText={text => setFormData({ ...formData, placeOfBirth: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Parent Names"
                value={formData.parentNames}
                onChangeText={text => setFormData({ ...formData, parentNames: text })}
              />
            </>
          )}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitDocument}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isOnline ? 'Submit Document' : 'Save Offline'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 15,
    elevation: 5,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
    margin: 10,
    borderRadius: 10,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  usePhotoButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  usePhotoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  retakeButton: {
    borderColor: '#2563eb',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  formImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
