import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/components/rounded-button/styles.module';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import SavingSpinner from './ui/SavingSpinner';

type Props = {
  text: string;
  href?: string;
  onPress?: (event?: any) => void;
  color?: string;
  fontColor?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  isSaving?: boolean;
};
const RoundedButton = ({
  text,
  href,
  onPress,
  color = Colors.white,
  fontColor = Colors.white,
  fullWidth = false,
  disabled = false,
  isSaving = false,
}: Props) => {
  const content = (
    <View
      style={[
        styles.button,
        { backgroundColor: color },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      {isSaving ? (
        <SavingSpinner color={Colors.black} />
      ) : (
        <Text style={[styles.text, { color: fontColor }]}>{text}</Text>
      )}
    </View>
  );

  if (href) {
    return (
      <Link href={{ pathname: href as any }} disabled={disabled}>
        {content}
      </Link>
    );
  }

  return (
    <Pressable
      onPress={event => {
        event.stopPropagation();
        onPress?.(event);
      }}
      disabled={disabled}
    >
      {content}
    </Pressable>
  );
};

export default RoundedButton;
