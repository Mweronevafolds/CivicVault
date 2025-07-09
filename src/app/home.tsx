import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// A standard blue color for the theme. You can change this later.
const THEME_COLOR = '#007AFF';

type MenuItem = {
  title: string;
  icon: string;
  screen: '/camera' | '/view-applications';
  params?: { docType: 'birth' | 'id' };
} | {
  title: string;
  icon: string;
  screen: string;
  params?: undefined;
};

export default function HomeScreen() {
  const { userName } = useLocalSearchParams();
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  const menuItems = [
    { title: 'Register Birth', icon: 'baby-face-outline', screen: '/camera', params: { docType: 'birth' } },
    { title: 'Request ID', icon: 'card-account-details-outline', screen: '/camera', params: { docType: 'id' } },
    { title: 'View My Applications', icon: 'file-document-multiple-outline', screen: '/view-applications' },
    { title: 'Dashboard', icon: 'view-dashboard-outline', screen: '/dashboard' },
  ] as MenuItem[];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {userName || 'User'}</Text>
      
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.button} 
            onPress={() => router.push({ pathname: item.screen as any, params: item.params })}
          >
            <MaterialCommunityIcons name={item.icon as any} size={48} color={THEME_COLOR} />
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>INCLUSIVE BIRTH & ID REGISTRATION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    aspectRatio: 1,
  },
  buttonText: {
    marginTop: 10,
    color: THEME_COLOR,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_COLOR,
  },
  logoutButtonText: {
    color: THEME_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    color: 'gray',
    fontSize: 12,
  }
});
