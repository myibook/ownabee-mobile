import RoundedButton from "@/components/RoundedButton";
import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/grammar-complete/styles.module";
import React from "react";
import { Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function WritingCompleteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Great job! You’ve finishing{"\n"}
          reviewing your story.{"\n"}Now, let’s move onto adding images!
        </Text>
      </View>
      <ConfettiCannon
        count={100}
        origin={{ x: 200, y: 0 }}
        fadeOut
        fallSpeed={3000}
      />
      <View style={styles.footer}>
        <RoundedButton
          text="Back"
          href="/grammar-check"
          color={Colors.backgroundPurple}
          fontColor={Colors.black}
        />
        <RoundedButton
          text="Add images"
          href="/image-format"
          color={Colors.white}
          fontColor={Colors.black}
        />
      </View>
    </View>
  );
}
