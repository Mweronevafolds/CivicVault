import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert, // NEW: For showing messages
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // NEW: For local storage
import { useOffline } from '../context/OfflineContext'; // NEW: Our custom hook

// NEW: A constant for our session key
const SESSION_KEY = '@CivicVault:userSession';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOnline } = useOffline(); // NEW: Get network status from our context

  // NEW: This effect runs when the screen loads to check for an offline session
  useEffect(() => {
    const checkOfflineSession = async () => {
      if (!isOnline) {
        try {
          const savedSession = await AsyncStorage.getItem(SESSION_KEY);
          if (savedSession) {
            console.log('Found offline session, logging in automatically.');
            navigation.replace('Home'); // Go directly to Home screen
          }
        } catch (e) {
          console.error('Failed to load offline session', e);
        }
      }
    };

    checkOfflineSession();
  }, [isOnline]); // Reruns if the network status changes

  const handleLogin = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline',
        'No internet connection. Please connect to the internet to log in for the first time.'
      );
      return;
    }

    setIsLoading(true);

    // --- MOCK API CALL ---
    // In a real app, you would replace this with a fetch call to your Kotlin backend
    setTimeout(async () => {
      if (username.toLowerCase() === 'user' && password === 'password') {
        try {
          // NEW: Save the session on successful online login
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ username, loggedInAt: Date.now() }));
          console.log('Online login successful, session saved.');
          navigation.replace('Home'); // Navigate to the Home screen
        } catch (e) {
          Alert.alert('Error', 'Could not save user session.');
        }
      } else {
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* NEW: Visual indicator for network status */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>You are currently offline</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="person-circle-outline" size={60} color="#fff" />
        </View>
        <Text style={styles.title}>Login</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username (user)"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password (password)"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Ionicons name="lock-closed-outline" size={24} color="#888" style={styles.lockIcon} />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink}>
            <Text style={styles.registerText}>New user? <Text style={styles.registerLinkText}>Register here</Text></Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>INCLUSIVE BIRTH & ID REGISTRATION</Text>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  // NEW: Styles for the offline banner
  offlineBanner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#ffc107',
    padding: 8,
    alignItems: 'center',
  },
  offlineBannerText: {
    color: '#000',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 25,
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
  },
  lockIcon: {
    paddingRight: 15,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
      marginTop: 20,
      alignItems: 'center',
  },
  registerText: {
      fontSize: 14,
      color: '#555',
  },
  registerLinkText: {
      color: '#2563eb',
      fontWeight: 'bold',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#888',
    fontSize: 12,
  },
});

export default LoginScreen;
