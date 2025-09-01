import React, { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface IconButtonProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

const IconButton = ({ children, onPress, disabled }: IconButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.darkGray,
    borderRadius: 24,
    padding: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;
