import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useOffline } from '../context/OfflineContext';
import { ThemeColors, useTheme } from '../context/ThemeContext';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  parentNames: string;
}

interface DocumentData {
  docType: 'birth' | 'id';
  imageUri: string | null;
  formData: FormData;
  timestamp: number;
}

export default function CameraScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { docType } = useLocalSearchParams<{ docType: 'birth' | 'id' }>();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    parentNames: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOnline, addToQueue } = useOffline();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

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
      router.back();
    } else if (currentStep === 2) {
      setCapturedImage(null);
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
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
    return Object.keys(errors).length === 0;
  };

  const submitDocument = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error", 
        "Please fill in all required fields correctly."
      );
      return;
    }

    setIsSubmitting(true);
    const documentData: DocumentData = {
      docType: docType!,
      imageUri: capturedImage,
      formData,
      timestamp: Date.now(),
    };


    if (isOnline) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Success', 'Document submitted successfully');
        router.replace('/home');
      } catch (error) {
        Alert.alert('Error', 'Submission failed. Saving offline.');
        addToQueue(documentData);
        router.replace('/home');
      }
    } else {
      addToQueue(documentData);
      Alert.alert('Offline', 'No connection. Document saved and will sync when you are back online.');
      router.replace('/home');
    }
    setIsSubmitting(false);
  };
  
  const styles = getThemedStyles(colors);
  
  if (!permission) {
    return <View style={styles.centered}><Text style={{color: colors.text}}>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return <View style={styles.centered}><Text style={{color: colors.text}}>No access to camera</Text></View>;
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style={colors.background === '#121212' ? 'light' : 'dark'} />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.buttonText }]}>
          {currentStep === 1 && `Capture ${docType === 'birth' ? 'Birth Certificate' : 'ID'}`}
          {currentStep === 2 && 'Review Photo'}
          {currentStep === 3 && (docType === 'birth' ? 'Birth Certificate' : 'ID') + ' Details'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {currentStep === 1 && (
        <>
          <CameraView 
            style={styles.camera}
            facing="back"
            ref={cameraRef}
          />
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isCapturing}>
              {isCapturing ? <ActivityIndicator size="large" color={colors.primary} /> : <Ionicons name="camera" size={40} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </>
      )}

      {currentStep === 2 && capturedImage && (
        <>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.usePhotoButton} onPress={() => setCurrentStep(3)}>
              <Text style={styles.usePhotoButtonText}>Use Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retakeButton} onPress={() => { setCapturedImage(null); setCurrentStep(1); }}>
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {currentStep === 3 && (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Image source={{ uri: capturedImage! }} style={styles.formImage} />
          <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.input, validationErrors.fullName && styles.inputError]}
              placeholder="Full Name *"
              placeholderTextColor={colors.text + '80'}
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


          <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.input, validationErrors.dateOfBirth && styles.inputError]}
              placeholder="Date of Birth (YYYY-MM-DD) *"
              placeholderTextColor={colors.text + '80'}
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
              <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
                <TextInput
                  style={[styles.input, validationErrors.placeOfBirth && styles.inputError]}
                  placeholder="Place of Birth *"
                  placeholderTextColor={colors.text + '80'}
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


              <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground }]} placeholder="Parent Names" placeholderTextColor={colors.text + '80'} value={formData.parentNames} onChangeText={text => setFormData({ ...formData, parentNames: text })} />

            </>
          )}
          <TouchableOpacity style={styles.submitButton} onPress={submitDocument} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>{isOnline ? 'Submit Document' : 'Save Offline'}</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  cameraContainer: ViewStyle;
  previewImage: ImageStyle;
  buttonContainer: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  formContainer: ViewStyle;
  inputContainer: ViewStyle;
  inputError: TextStyle;
  errorText: TextStyle;
  centered: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  camera: ViewStyle;
  captureButtonContainer: ViewStyle;
  captureButton: ViewStyle;
  previewButtons: ViewStyle;
  usePhotoButton: ViewStyle;
  usePhotoButtonText: TextStyle;
  retakeButton: ViewStyle;
  retakeButtonText: TextStyle;
  formImage: ImageStyle;
  input: TextStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  stepContainer: ViewStyle;
  stepText: TextStyle;
  stepTitle: TextStyle;
  loadingContainer: ViewStyle;
  formRow: ViewStyle;
}

const getThemedStyles = (colors: ThemeColors): Styles => StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
    margin: 10,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.card,
  },
  button: {
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  headerTitle: {
    color: colors.buttonText,
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
    backgroundColor: colors.card,
    borderRadius: 40,
    padding: 15,
    elevation: 5,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  usePhotoButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  usePhotoButtonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  retakeButton: {
    borderColor: colors.primary,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  formImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    color: colors.inputText,
  },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  stepContainer: {
    marginBottom: 20,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
  },
  stepText: {
    color: colors.text,
    fontSize: 14,
    marginTop: 5,
  },
  stepTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
