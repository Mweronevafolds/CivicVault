import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  inputBackground: string;
  inputText: string;
  buttonText: string;
  error: string;
  success: string;
};

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
};

const lightColors: ThemeColors = {
  primary: '#007AFF',
  background: '#ffffff',
  card: '#f8f8f8',
  text: '#1a1a1a',
  border: '#e0e0e0',
  notification: '#ff3b30',
  inputBackground: '#f5f5f5',
  inputText: '#1a1a1a',
  buttonText: '#ffffff',
  error: '#ff3b30',
  success: '#34c759',
};

const darkColors: ThemeColors = {
  primary: '#0a84ff',
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  border: '#2c2c2e',
  notification: '#ff453a',
  inputBackground: '#2c2c2e',
  inputText: '#ffffff',
  buttonText: '#ffffff',
  error: '#ff453a',
  success: '#30d158',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>('system');
  
  // Determine if dark mode should be used based on theme preference
  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  
  // Colors based on current theme
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
