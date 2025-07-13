import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import our API function to get community data
import { getCommunitySubmissions } from '../api/ApiService';

interface Submission {
  id: string;
  doc_type: string;
  latitude: number;
  longitude: number;
  user_id: string;
}

const FullScreenMap: React.FC = () => {
  const router = useRouter();

  // State for loading, error, and live data
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect to fetch data when the screen loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCommunitySubmissions();
        setSubmissions(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once when the component mounts

  return (
    <SafeAreaView style={styles.container}>
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
      
      {/* Conditional rendering based on loading/error state */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.infoText}>Loading Community Map...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color="red" />
          <Text style={styles.infoText}>Error: {error}</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -1.292066, // Center on Nairobi
            longitude: 36.821945,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05,
          }}
        >
          {/* Map over the live submissions data from the state */}
          {submissions.map(submission => (
            <Marker
              key={submission.id}
              coordinate={{ latitude: submission.latitude, longitude: submission.longitude }}
              title={submission.doc_type}
              description={`Submitted by: User ${submission.user_id.substring(0, 5)}...`}
            >
              <View style={[
                  styles.marker,
                  { backgroundColor: submission.doc_type === 'ID Card' ? '#28a745' : '#007bff' }
              ]}>
                  <Ionicons 
                      name={submission.doc_type === 'ID Card' ? 'id-card' : 'person'} 
                      size={16} 
                      color="#fff" 
                  />
              </View>
            </Marker>
          ))}
        </MapView>
      )}
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
  },
  // Styles for loading and error states
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default FullScreenMap;
