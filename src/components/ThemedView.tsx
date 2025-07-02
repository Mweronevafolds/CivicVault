import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export const ThemedView: React.FC<ViewProps> = (props: ViewProps) => {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  return <View {...props} style={[{ backgroundColor }, props.style]} />;
};
