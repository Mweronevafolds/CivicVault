import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

interface MobileMapProps {
  children?: React.ReactNode;
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function MobileMap({ children, region }: MobileMapProps) {
  const defaultRegion = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      region={region || defaultRegion}
    >
      {children}
    </MapView>
  );
}
