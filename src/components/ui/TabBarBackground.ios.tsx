import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, ViewStyle } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
