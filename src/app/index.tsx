import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { OfflineContext } from '../context/OfflineContext';
import { Colors } from '../constants/Colors';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  const { isOnline } = useContext(OfflineContext);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem('@CivicVault:userSession');
        if (savedSession) {
          setHasSession(true);
        } else {
          setHasSession(false);
        }
      } catch (e) {
        setHasSession(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    if (!isOnline) {
      if (hasSession) {
        // Allow offline login if session exists
        setLoading(false);
        router.replace({ pathname: '/home', params: { userName: 'User' } });
        return;
      } else {
        setLoading(false);
        Alert.alert('Offline', 'No internet connection and no saved session. Please connect to the internet to log in for the first time.');
        return;
      }
    }

    // Mock login logic
    setTimeout(async () => {
      if (username.toLowerCase() === 'user' && password === 'password') {
        try {
          await AsyncStorage.setItem('@CivicVault:userSession', JSON.stringify({ username: username.toLowerCase(), loggedInAt: Date.now() }));
          setLoading(false);
          router.replace({ pathname: '/home', params: { userName: 'User' } });
        } catch (e) {
          setLoading(false);
          Alert.alert('Error', 'Could not save user session.');
        }
      } else {
        setLoading(false);
        Alert.alert('Login Failed', 'Invalid username or password.');
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="person-pin" size={80} color={Colors.light.primary} />
        <Text style={styles.title}>Login</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Username (user)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={isOnline || hasSession}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (password)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={isOnline || hasSession}
      />

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin} 
        disabled={loading || (!isOnline && !hasSession)}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      {!isOnline && !hasSession && (
        <Text style={styles.offlineText}>You are offline. Login is disabled.</Text>
      )}

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.registerText}>New user? Register here</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>INCLUSIVE BIRTH & ID REGISTRATION</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerText: {
    color: Colors.light.primary,
    textAlign: 'center',
    marginTop: 20,
  },
  offlineText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 15,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    color: 'gray',
    fontSize: 12,
  },
});
