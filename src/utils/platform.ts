import { Platform } from 'react-native';

// Check if we're running in a web environment
export const isWeb = Platform.OS === 'web';

// Safe dynamic import function that works in both web and native environments
export const safeDynamicImport = async <T>(moduleId: string): Promise<T | null> => {
  if (isWeb) {
    // For web, we'll return null as we can't dynamically import Node.js modules
    return null;
  }
  
  try {
    // For React Native, we can use require
    return require(moduleId);
  } catch (error) {
    console.warn(`Module ${moduleId} could not be loaded:`, error);
    return null;
  }
};

/**
 * Returns the current platform (ios, android, or web)
 * @returns The current platform
 */
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
};

/**
 * Returns true if the current platform is web
 */
// isWeb is already exported above

/**
 * Returns true if the current platform is iOS
 */
export const isIOS = getPlatform() === 'ios';

/**
 * Returns true if the current platform is Android
 */
export const isAndroid = getPlatform() === 'android';
