import RoundedButton from "@/components/RoundedButton";
import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/writing-complete/styles.module";
import React, { useEffect } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface FloatingLogoProps {
  phase: number; // 시작 시점 차이
  size?: number;
  speed?: number;
}

const FloatingLogo = ({
  phase = 0,
  size = 60,
  speed = 3000,
}: FloatingLogoProps) => {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(Math.PI * 2, { duration: speed }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const localT = t.value + phase; // 시작 위치 다르게
    const scale = 2 / (3 - Math.cos(2 * localT));
    const tx = scale * Math.cos(localT) * (width / 2 - 60);
    const ty = scale * (Math.sin(2 * localT) / 2) * 120;

    return {
      transform: [{ translateX: tx }, { translateY: ty }],
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Image
        source={require("./../assets/images/logo.png")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default function WritingCompleteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Great job! You’ve finishing writing {"\n"}your story. Now, let’s move
          on to{"\n"}reviewing your grammar.
        </Text>
      </View>
      <FloatingLogo phase={0} speed={8000} />
      <FloatingLogo phase={1} size={50} speed={7000} />
      <FloatingLogo phase={2} size={70} speed={6500} />
      <ConfettiCannon
        count={100}
        origin={{ x: 200, y: 0 }}
        fadeOut
        fallSpeed={3000}
      />
      <View style={styles.footer}>
        <RoundedButton
          text="Back"
          href="/story-editor"
          color={Colors.lightYellow}
          fontColor={Colors.black}
        />
        <RoundedButton
          text="Review Grammar"
          href="/grammar-check"
          color={Colors.white}
          fontColor={Colors.black}
        />
      </View>
    </View>
  );
}
