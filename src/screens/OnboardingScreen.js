import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useColorScheme } from '../hooks/useColorScheme';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Done = ({ ...props }) => (
    <TouchableOpacity style={{marginHorizontal:15}} {...props}>
        <Text style={{fontSize:16}}>Done</Text>
    </TouchableOpacity>
);

const handleDone = () => {
    AsyncStorage.setItem('alreadyLaunched', 'true');
    router.replace('/(auth)');
}

const OnboardingScreen = () => {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#FFFFFF';
  const titleStyles = { color: isDark ? '#FFFFFF' : '#000000' };
  const subTitleStyles = { color: isDark ? '#CCCCCC' : '#333333' };

  const pages = [
      {
        backgroundColor,
        image: <Image style={styles.image} source={isDark ? require('../../assets/images/onboarding-dark-1.jpg.png') : require('../../assets/images/onboarding-light-1.jpg.png')} />,
        title: 'Welcome to CivicVault!',
        subtitle: 'Your secure and simple solution for birth and ID registration.',
        titleStyles,
        subTitleStyles,
      },
      {
        backgroundColor,
        image: <Image style={styles.image} source={isDark ? require('../../assets/images/onboarding-dark-2.jpg.png') : require('../../assets/images/onboarding-light-2.jpg.png')} />,
        title: 'Securely Manage Your Identity',
        subtitle: 'Keep your important civic documents safe and accessible anytime, anywhere.',
        titleStyles,
        subTitleStyles,
      },
      {
        backgroundColor,
        image: <Image style={styles.image} source={isDark ? require('../../assets/images/onboarding-dark-3.jpg.png') : require('../../assets/images/onboarding-light-3.jpg.png')} />,
        title: 'Get Started Easily',
        subtitle: 'Quickly register and access your civic documents with ease.',
        titleStyles,
        subTitleStyles,
      },
  ];

  return (
    <Onboarding
        onSkip={handleDone}
        onDone={handleDone}
        pages={pages}
        DoneButtonComponent={Done}
    />
  );
};

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    }
})

export default OnboardingScreen;
