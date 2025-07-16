import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WebMap() {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={48} color="#6b7280" />
      <Text style={styles.text}>Map view is available on the mobile app.</Text>
      <Text style={styles.subtext}>
        (Full web map functionality requires additional API key configuration)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 300, // Ensure it takes up space
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  subtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});
