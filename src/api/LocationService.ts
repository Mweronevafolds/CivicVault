import { Platform } from 'react-native';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    // Request permissions if needed
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      return null;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

export async function getLocationFromMedia(mediaUri: string): Promise<LocationData | null> {
  try {
    // For web, we can't get location from media directly
    if (Platform.OS === 'web') {
      return null;
    }

    // TODO: Implement location extraction from media EXIF data
    // This would require additional libraries and handling
    return null;
  } catch (error) {
    console.error('Error getting location from media:', error);
    return null;
  }
}
