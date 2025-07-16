import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ActivityIndicator, Image, useColorScheme, KeyboardAvoidingView,
    ScrollView, Platform, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { supabase } from '../config/client';
import { useTheme } from '../context/ThemeContext';

// Import images from the root assets folder
import lightLogo from '../../assets/images/logo-light-1.jpg.png';
import darkLogo from '../../assets/images/logo-dark.jpg.png';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { colors } = useTheme();
    const colorScheme = useColorScheme();
    const logo = colorScheme === 'dark' ? darkLogo : lightLogo;

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
            
            // Get the user's session
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch the user's profile from Supabase
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                }
            }
            
            console.log('User signed in:', email);
            // On success, navigate to the home screen under (tabs)
            router.replace('/(tabs)/home');
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
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: 'civicvault://home',
                },
            });
            if (error) throw error;
            Alert.alert('Check your email', 'A confirmation link has been sent to your email address.');
            setIsSignUp(false);
        } catch (e: any) {
            setError(e.message || 'Failed to create account.');
        } finally {
            setIsLoading(false);
        }
    };

    const themedStyles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
        logoContainer: { alignItems: 'center', marginBottom: 30 },
        logo: { width: 150, height: 150, resizeMode: 'contain' },
        title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: colors.text },
        input: { height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, backgroundColor: colors.inputBackground, color: colors.inputText },
        button: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
        buttonText: { color: colors.buttonText, fontSize: 16, fontWeight: '600' },
        toggleButton: { marginTop: 20, alignItems: 'center' },
        toggleText: { color: colors.primary, fontSize: 14 },
        errorContainer: { backgroundColor: colors.error + '20', padding: 12, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: colors.error },
        errorText: { color: colors.error, fontSize: 14, lineHeight: 20 },
    });

    return (
        <KeyboardAvoidingView style={themedStyles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={themedStyles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={themedStyles.logoContainer}>
                        <Image source={logo} style={themedStyles.logo} />
                    </View>

                    <Text style={themedStyles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>

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
                    <TouchableOpacity style={themedStyles.button} onPress={isSignUp ? handleSignUp : handleSignIn} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color={colors.buttonText} /> : <Text style={themedStyles.buttonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={themedStyles.toggleButton} onPress={() => { setIsSignUp(!isSignUp); setError(''); }}>
                        <Text style={themedStyles.toggleText}>
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default AuthScreen;
