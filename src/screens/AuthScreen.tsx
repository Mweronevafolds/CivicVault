import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase-init';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { UserCredential, AuthError } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user.email);
      navigation.navigate('home', { userName: email });
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.email);
      navigation.navigate('home', { userName: email });
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  const { colors } = useTheme();
  
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: colors.text,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      fontSize: 16,
      backgroundColor: colors.inputBackground,
      color: colors.inputText,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    toggleButton: {
      marginTop: 20,
      alignItems: 'center',
    },
    toggleText: {
      color: colors.primary,
      fontSize: 14,
    },
    errorContainer: {
      backgroundColor: colors.error + '20',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      lineHeight: 20,
    },
  });

  return (
    <View style={themedStyles.container}>
      <Text style={themedStyles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
      
      {error ? (
        <View style={themedStyles.errorContainer}>
          <Text style={themedStyles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={themedStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={colors.text + '80'}
      />

      <TextInput
        style={themedStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.text + '80'}
      />

      <TouchableOpacity 
        style={themedStyles.button} 
        onPress={isSignUp ? handleSignUp : handleSignIn}
      >
        <Text style={themedStyles.buttonText}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={themedStyles.toggleButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={themedStyles.toggleText}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;
