import React, { useEffect, useState } from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Provider, Marker } from 'react-native-maps';
import { getCurrentLocation, LocationData } from '../../src/api/LocationService';
import { supabase } from '../../src/config/client';

interface MapProps {
  children?: React.ReactNode;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  provider?: Provider;
  style?: ViewStyle;
}

export default function Map({
  children,
  region = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  provider = PROVIDER_GOOGLE,
  style = { flex: 1 }
}: MapProps) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null
  });

  useEffect(() => {
    // Fetch registrations with locations
    const fetchRegistrations = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, doc_type, full_name, latitude, longitude, created_at')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching registrations:', error);
        return;
      }

      setRegistrations(data || []);
    };

    fetchRegistrations();
  }, []);

  useEffect(() => {
    // Get current location
    if (Platform.OS === 'web') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <View style={style}>
      <MapView
        provider={provider}
        region={currentLocation?.latitude && currentLocation?.longitude ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : region}
        style={{ flex: 1 }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Current location marker */}
        {currentLocation?.latitude && currentLocation?.longitude && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude
            }}
            title="Current Location"
            pinColor="blue"
          />
        )}

        {/* Registration markers */}
        {registrations.map((registration) => (
          <Marker
            key={registration.id}
            coordinate={{
              latitude: registration.latitude,
              longitude: registration.longitude,
            }}
            title={`${registration.doc_type} for ${registration.full_name}`}
            description={`Registered on ${new Date(registration.created_at).toLocaleDateString()}`}
            pinColor="red"
          />
        ))}

        {children}
      </MapView>
    </View>
  );
}
