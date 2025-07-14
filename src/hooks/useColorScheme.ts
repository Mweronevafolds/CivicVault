import { useColorScheme as _useColorScheme } from 'react-native';

// This hook will return 'light' or 'dark' based on the user's device settings.
export function useColorScheme(): 'light' | 'dark' {
  return _useColorScheme() ?? 'light';
}
