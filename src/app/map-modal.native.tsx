import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCommunitySubmissions } from '../api/ApiService';

interface Submission {
  id: string;
  doc_type: string;
  latitude: number;
  longitude: number;
  user_id: string;
}

// Correctly using "export default"
export default function FullScreenMapNative() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCommunitySubmissions()
      .then(data => setSubmissions(data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" /></View>
      ) : error ? (
        <View style={styles.center}><Text>Error: {error}</Text></View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -1.292066,
            longitude: 36.821945,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05,
          }}
        >
          {submissions.map(submission => (
            <Marker
              key={submission.id}
              coordinate={{ latitude: submission.latitude, longitude: submission.longitude }}
              title={submission.doc_type}
            />
          ))}
        </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
