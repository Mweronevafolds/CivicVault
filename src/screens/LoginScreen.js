import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase-init';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@CivicVault:userSession';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isOnline } = useOffline();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    const checkOfflineSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (savedSession) {
          console.log('Found offline session, logging in automatically.');
          navigation.replace('screens/HomeScreen', { userName: username });
        }
      } catch (e) {
        console.error('Failed to load offline session', e);
      }
    };

    checkOfflineSession();
  }, [isOnline]);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      console.log('User signed in:', userCredential.user.email);

      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        lastLogin: new Date().toISOString()
      }));

      navigation.replace('screens/HomeScreen', { userName: username });

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar style={isDark ? 'light' : 'dark'} />

          {!isOnline && (
            <View style={[styles.offlineBanner, { backgroundColor: colors.notification }]}>
              <Text style={[styles.offlineBannerText, { color: colors.text }]}>
                You are currently offline
              </Text>
            </View>
          )}

          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="person-circle-outline" size={60} color={colors.buttonText} />
            </View>
            <Text style={[styles.title, { color: colors.primary }]}>Login</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.inputText
                }
              ]}
              placeholder="Username (demo)"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={[
              styles.passwordContainer,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border
              }
            ]}>
              <TextInput
                style={[
                  styles.inputPassword,
                  { color: colors.inputText }
                ]}
                placeholder="Password (demo123)"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: colors.primary }]} 
              onPress={handleLogin} 
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={[styles.loginButtonText, { color: colors.buttonText }]}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.registerText, { color: colors.text }]}>
                New user? <Text style={[styles.registerLinkText, { color: colors.primary }]}>Register here</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.footerText, { color: colors.text }]}>
            INCLUSIVE BIRTH & ID REGISTRATION
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  offlineBanner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    padding: 8,
    alignItems: 'center',
    zIndex: 1,
  },
  offlineBannerText: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 25,
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLinkText: {
    fontWeight: 'bold',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    fontSize: 12,
  },
});

export default LoginScreen;
