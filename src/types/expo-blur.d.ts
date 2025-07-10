declare module 'expo-blur' {
  import { ViewStyle } from 'react-native';

  export interface BlurViewProps {
    tint: 'light' | 'dark' | 'systemChromeMaterial' | 'systemChromeMaterialDark' | 'systemChromeMaterialLight';
    intensity: number;
    style?: ViewStyle;
  }

  export const BlurView: React.ComponentType<BlurViewProps>;
}
