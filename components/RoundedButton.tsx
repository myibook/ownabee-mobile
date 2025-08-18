import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/components/rounded-button/styles.module";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import SavingSpinner from "./ui/SavingSpinner";

type Props = {
  text: string;
  href?: string;
  onPress?: () => void;
  color?: string;
  fontColor?: string;
  disabled?: boolean;
  isSaving?: boolean;
};
const RoundedButton = ({
  text,
  href,
  onPress,
  color = Colors.white,
  fontColor = Colors.white,
  disabled = false,
  isSaving = false,
}: Props) => {
  const content = (
    <View
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
      ]}
    >
      {isSaving ? (
        <SavingSpinner />
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
    <Pressable onPress={onPress} disabled={disabled}>
      {content}
    </Pressable>
  );
};

export default RoundedButton;
