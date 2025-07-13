import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../config/client';
import { useTheme } from '../context/ThemeContext';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      setError('');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      console.log('User signed in:', email);
      router.replace('/home');
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    
    setIsLoading(true);
    try {
      setError('');
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: 'civicvault://home',
        },
      });
      
      if (error) {
        throw error;
      }
      
      Alert.alert(
        'Check your email',
        'We\'ve sent you a confirmation email. Please verify your email address to complete registration.'
      );
      
      // Switch to sign in view after successful sign up
      setIsSignUp(false);
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={themedStyles.buttonText}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
        )}
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
