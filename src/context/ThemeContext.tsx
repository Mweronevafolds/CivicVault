import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  inputBackground: string;
  inputText: string;
  buttonText: string;
  error: string;
  success: string;
  warning: string;
  successSoft: string;
  warningSoft: string;
};

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
};

const lightColors: ThemeColors = {
  primary: '#3b82f6',
  background: '#f1f5f9',
  card: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  notification: '#ff3b30',
  inputBackground: '#f5f5f5',
  inputText: '#1a1a1a',
  buttonText: '#ffffff',
  error: '#ff3b30',
  success: '#22c55e',
  warning: '#f59e0b',
  successSoft: '#dcfce7',
  warningSoft: '#fef9c3',
};

const darkColors: ThemeColors = {
  primary: '#0a84ff',
  background: '#121212',
  card: '#1e1e1e',
  text: '#f8fafc',
  textSecondary: '#888888',
  border: '#2c2c2e',
  notification: '#ff453a',
  inputBackground: '#2c2c2e',
  inputText: '#ffffff',
  buttonText: '#ffffff',
  error: '#ff453a',
  success: '#30d158',
  warning: '#facc15',
  successSoft: '#1c4532',
  warningSoft: '#422006',
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
