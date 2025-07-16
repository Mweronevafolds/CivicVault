import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

export default function DashboardWeb() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Dashboard' }} />
      <View style={styles.center}>
        <Ionicons name="stats-chart-outline" size={40} color="#2563eb" />
        <Text style={styles.infoText}>Dashboard is available on the mobile app.</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Text style={{ color: '#2563eb', marginTop: 15 }}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  infoText: { marginTop: 15, fontSize: 18 },
});
