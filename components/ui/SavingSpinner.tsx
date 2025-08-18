// components/ui/SavingSpinner.tsx

import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

export default function SavingSpinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
      <Feather name="loader" size={22} color={Colors.white} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
  },
});
