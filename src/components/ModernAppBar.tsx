import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface ModernAppBarProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  showBackButton?: boolean;
  style?: ViewStyle;
  elevation?: number;
}

const ModernAppBar: React.FC<ModernAppBarProps> = ({
  title,
  onBack,
  rightContent,
  showBackButton = true,
  style,
  elevation = 3,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: elevation / 3 },
          shadowOpacity: 0.15,
          shadowRadius: elevation,
          elevation,
          paddingTop: insets.top + 10, // Add safe area inset to padding
          height: 60 + insets.top, // Adjust height dynamically
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBackButton && onBack && (
            <TouchableOpacity 
              onPress={onBack} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        <Text 
          style={[
            styles.title, 
            { color: colors.text },
            !showBackButton && { textAlign: 'center' }
          ]} 
          numberOfLines={1}
        >
          {title}
        </Text>
        
        <View style={styles.rightContainer}>
          {rightContent || <View style={{ width: 40 }} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 10, // Reduced for a more compact look
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default ModernAppBar;
