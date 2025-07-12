import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, Image, Alert, ScrollView, TextInput, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../context/OfflineContext';
import { ThemeColors, useTheme } from '../context/ThemeContext';
import ModernAppBar from '../components/ModernAppBar';

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
  const cameraRef = useRef<CameraView>(null);
  const theme = useTheme();
  const isDark = theme.colors.background === '#121212';
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
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

  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s\-']{2,50}$/;
    return nameRegex.test(name);
  };

  const validateDateOfBirth = (dob: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) return false;
    
    const date = new Date(dob);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120); // Max age 120 years
    
    return date <= today && date >= minDate;
  };

  const validatePlace = (place: string): boolean => {
    const placeRegex = /^[A-Za-z\s\-',.]{2,100}$/;
    return placeRegex.test(place);
  };

  const formatDateInput = (text: string): string => {
    // Remove all non-digit characters
    let cleaned = text.replace(/\D/g, '');
    
    // Format as YYYY-MM-DD
    if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    } else if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
    }
    
    return cleaned.slice(0, 10);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (!validateName(formData.fullName)) {
      errors.fullName = 'Please enter a valid name (2-50 characters, letters and spaces only)';
    }
    
    // Date of Birth validation
    if (!formData.dateOfBirth.trim()) {
      errors.dateOfBirth = 'Date of Birth is required';
    } else if (!validateDateOfBirth(formData.dateOfBirth)) {
      errors.dateOfBirth = 'Please enter a valid date (YYYY-MM-DD)';
    }
    
    // Place of Birth validation (only for birth certificate)
    if (docType === 'birth') {
      if (!formData.placeOfBirth.trim()) {
        errors.placeOfBirth = 'Place of Birth is required';
      } else if (!validatePlace(formData.placeOfBirth)) {
        errors.placeOfBirth = 'Please enter a valid place name';
      }
    }
    
    // Parent Names validation (only for birth certificate)
    if (docType === 'birth' && formData.parentNames.trim() && !validateName(formData.parentNames)) {
      errors.parentNames = 'Please enter valid names (2-50 characters, letters and spaces only)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitDocument = async () => {
    if (!validateForm()) {
      // Scroll to the first error if there are any
      const firstError = Object.keys(validationErrors)[0];
      if (firstError) {
        const errorElement = document.getElementById(firstError);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    
    // Format data before submission
    const formattedFormData: FormData = {
      ...formData,
      fullName: formData.fullName.trim().replace(/\s+/g, ' '),
      dateOfBirth: formData.dateOfBirth.trim(),
      placeOfBirth: formData.placeOfBirth.trim(),
      parentNames: formData.parentNames.trim(),
    };

    const documentData: DocumentData = {
      docType: docType!,
      imageUri: capturedImage,
      formData: formattedFormData,
      timestamp: Date.now(),
    };

    try {
      if (isOnline) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        Alert.alert('Success', 'Document submitted successfully');
      } else {
        addToQueue(documentData);
        Alert.alert('Offline', 'No connection. Document saved and will sync when you are back online.');
      }
      router.replace('/home');
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'An error occurred. Your document has been saved and will sync when you are back online.');
      addToQueue(documentData);
      router.replace('/home');
    } finally {
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
  };
  
  const styles = getThemedStyles(colors);
  
  if (!permission) {
    return (
      <View style={styles.container}>
        <ModernAppBar 
          title="Camera" 
          onBack={() => router.back()}
          elevation={0}
        />
        <View style={styles.permissionContent}>
          <Text style={[styles.permissionText, { color: colors.text }]}>
            Requesting camera permission...
          </Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <ModernAppBar 
          title="Camera" 
          onBack={() => router.back()}
          elevation={0}
        />
        <View style={styles.permissionContent}>
          <Text style={[styles.permissionText, { color: colors.text }]}>
            No access to camera
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {currentStep === 1 && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={cameraFacing}
            ref={cameraRef}
          />
          <ModernAppBar 
            title="Take Photo" 
            onBack={handleBack}
            rightContent={
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() => {
                  setCameraFacing(prev => prev === 'back' ? 'front' : 'back');
                }}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            }
            style={{ backgroundColor: 'rgba(0,0,0,0.3)', position: 'absolute', top: 0, left: 0, right: 0 }}
          />
          <View style={[styles.captureButtonContainer, { position: 'absolute', bottom: 40, left: 0, right: 0 }]}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isCapturing}>
              {isCapturing ? <ActivityIndicator size="large" color={colors.primary} /> : <Ionicons name="camera" size={40} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </View>
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
        <ScrollView 
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={{ uri: capturedImage! }} style={styles.formImage} />
          <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
            <TextInput
              id="fullName"
              style={[styles.input, validationErrors.fullName && styles.inputError]}
              placeholder="Full Name *"
              placeholderTextColor={colors.text + '80'}
              value={formData.fullName}
              onChangeText={text => {
                // Only allow letters, spaces, hyphens, and apostrophes
                const cleanedText = text.replace(/[^A-Za-z\s\-']/g, '');
                setFormData({...formData, fullName: cleanedText});
                if (validationErrors.fullName) {
                  setValidationErrors(prev => ({...prev, fullName: ''}));
                }
              }}
              maxLength={50}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
            {validationErrors.fullName && (
              <Text style={styles.errorText}>{validationErrors.fullName}</Text>
            )}
          </View>

          <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
            <TextInput
              id="dateOfBirth"
              style={[styles.input, validationErrors.dateOfBirth && styles.inputError]}
              placeholder="Date of Birth (YYYY-MM-DD) *"
              placeholderTextColor={colors.text + '80'}
              value={formData.dateOfBirth}
              onChangeText={text => {
                const formattedText = formatDateInput(text);
                setFormData({...formData, dateOfBirth: formattedText});
                if (validationErrors.dateOfBirth) {
                  setValidationErrors(prev => ({...prev, dateOfBirth: ''}));
                }
              }}
              keyboardType="number-pad"
              maxLength={10}
            />
            {validationErrors.dateOfBirth && (
              <Text style={styles.errorText}>{validationErrors.dateOfBirth}</Text>
            )}
          </View>

          {docType === 'birth' && (
            <>
              <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
                <TextInput
                  id="placeOfBirth"
                  style={[styles.input, validationErrors.placeOfBirth && styles.inputError]}
                  placeholder="Place of Birth *"
                  placeholderTextColor={colors.text + '80'}
                  value={formData.placeOfBirth}
                  onChangeText={text => {
                    // Only allow letters, spaces, hyphens, commas, and periods
                    const cleanedText = text.replace(/[^A-Za-z\s\-',.]/g, '');
                    setFormData({...formData, placeOfBirth: cleanedText});
                    if (validationErrors.placeOfBirth) {
                      setValidationErrors(prev => ({...prev, placeOfBirth: ''}));
                    }
                  }}
                  maxLength={100}
                  autoCapitalize="words"
                />
                {validationErrors.placeOfBirth && (
                  <Text style={styles.errorText}>{validationErrors.placeOfBirth}</Text>
                )}
              </View>

              <View style={[styles.stepContainer, { backgroundColor: colors.card }]}>
                <TextInput 
                  id="parentNames"
                  style={[styles.input, validationErrors.parentNames && styles.inputError, { color: colors.text, backgroundColor: colors.inputBackground }]} 
                  placeholder="Parent Names (Optional)" 
                  placeholderTextColor={colors.text + '80'} 
                  value={formData.parentNames} 
                  onChangeText={text => {
                    // Only allow letters, spaces, hyphens, and apostrophes
                    const cleanedText = text.replace(/[^A-Za-z\s\-']/g, '');
                    setFormData({ ...formData, parentNames: cleanedText });
                    if (validationErrors.parentNames) {
                      setValidationErrors(prev => ({...prev, parentNames: ''}));
                    }
                  }}
                  maxLength={100}
                  autoCapitalize="words"
                />
                {validationErrors.parentNames && (
                  <Text style={styles.errorText}>{validationErrors.parentNames}</Text>
                )}
              </View>
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
  permissionContainer: ViewStyle;
  permissionContent: ViewStyle;
  permissionText: TextStyle;
  flipButton: ViewStyle;
}

const getThemedStyles = (colors: ThemeColors): Styles => StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
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
    flexGrow: 1,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: colors.background,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
    backgroundColor: colors.error + '10',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
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
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 14,
    marginBottom: 16,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
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
  permissionContainer: {
    flex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Offset for the app bar
  },
  permissionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
});
