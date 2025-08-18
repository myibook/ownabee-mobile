import RoundedButton from "@/components/RoundedButton";
import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/cover-complete/styles.module";
import React from "react";
import { Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function CoverCompleteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          One last step!
          Let's select a voice{"\n"}for your book.
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
          href="/cover-editor"
          color={Colors.baseBlue}
          fontColor={Colors.black}
        />
        <RoundedButton
          text="Select voice"
          href="/select-voice"
          color={Colors.white}
          fontColor={Colors.black}
        />
      </View>
    </View>
  );
}
