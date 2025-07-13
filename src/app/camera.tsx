import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
// NEW: Import CameraView and useCameraPermissions from expo-camera
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';

const CameraScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // NEW: Use the modern hook for permissions
  const [permission, requestPermission] = useCameraPermissions();
  
  const [capturedImage, setCapturedImage] = useState<{ uri: string } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // NEW: The ref should be typed to CameraView
  const cameraRef = useRef<CameraView | null>(null);

  // Check permissions when the component loads
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setCapturedImage(processedImage);
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
      console.error("Camera Error:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUsePhoto = () => {
    if (!capturedImage) return;
    router.push({
        pathname: '/form', // Corrected path
        params: { imageUri: capturedImage.uri, docType: params.type as string }
    });
  };

  // NEW: Updated permission checks
  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

    return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {capturedImage ? (
        // --- PREVIEW VIEW (No changes here) ---
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.retakeButton} onPress={() => setCapturedImage(null)}>
                <Ionicons name="refresh" size={24} color="#333" />
                <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.usePhotoButton} onPress={handleUsePhoto}>
                <Text style={styles.usePhotoButtonText}>Use Photo</Text>
                <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // --- CAMERA VIEW ---
        <>
          <CameraView style={styles.camera} facing={'back'} ref={cameraRef} />
          <View style={styles.cameraOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isCapturing}>
              {isCapturing ? <ActivityIndicator color="#2563eb" /> : <View style={styles.captureButtonInner} />}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionButton: { marginTop: 20, backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  permissionButtonText: { color: '#fff', fontWeight: 'bold' },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', paddingBottom: 40 },
  closeButton: { position: 'absolute', top: 50, left: 20, padding: 10 },
  captureButton: { alignSelf: 'center', width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 20 },
  captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', borderWidth: 3, borderColor: '#2563eb' },
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  previewImage: { width: '100%', height: '80%', resizeMode: 'contain' },
  previewControls: { position: 'absolute', bottom: 50, flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  retakeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30 },
  retakeButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  usePhotoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30 },
  usePhotoButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginRight: 8 },
});

export default CameraScreen;
