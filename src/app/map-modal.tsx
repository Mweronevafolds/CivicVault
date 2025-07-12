import React from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA for ALL public submissions ---
// In a real app, this would be fetched from a public API endpoint.
const allSubmissions = [
  { id: '101', type: 'Birth Certificate', lat: -1.286389, lon: 36.817223 },
  { id: '102', type: 'ID Request', lat: -1.292066, lon: 36.821945 },
  { id: '103', type: 'Birth Certificate', lat: -1.283333, lon: 36.816667 },
  { id: '104', type: 'ID Request', lat: -1.3032, lon: 36.8122 },
  { id: '105', type: 'Birth Certificate', lat: -1.2760, lon: 36.8250 },
  { id: '106', type: 'ID Request', lat: -1.2885, lon: 36.8000 },
];

const FullScreenMap = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Configure the header for this modal screen */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#343a40' },
          headerTintColor: '#fff',
          title: 'Community Registrations Map',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.292066, // Center on Nairobi
          longitude: 36.821945,
          latitudeDelta: 0.1, // Zoomed out a bit more
          longitudeDelta: 0.05,
        }}
      >
        {allSubmissions.map(submission => (
          <Marker
            key={submission.id}
            coordinate={{ latitude: submission.lat, longitude: submission.lon }}
            title={submission.type}
          >
            {/* Use a custom marker view for different colors */}
            <View style={[
                styles.marker,
                { backgroundColor: submission.type === 'ID Request' ? '#28a745' : '#007bff' }
            ]}>
                <Ionicons 
                    name={submission.type === 'ID Request' ? 'id-card' : 'person'} 
                    size={16} 
                    color="#fff" 
                />
            </View>
          </Marker>
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
      padding: 8,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 3,
  }
});

export default FullScreenMap;
