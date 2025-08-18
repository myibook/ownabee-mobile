import { Colors } from "@/constants/Colors";
import React, { useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function DraggableTextInput({
  id,
  text,
  onChangeText,
  onFocus,
  onDelete,
  fontSize,
  color,
  backgroundColor,
  fontFamily,
}: {
  id: number;
  text: string;
  onChangeText: (text: string) => void;
  onFocus: (id: number) => void;
  onDelete: () => void;
  fontSize: number;
  color: string;
  backgroundColor: string;
  fontFamily: string;
}) {
  const inputRef = useRef<TextInput>(null);
  const x = useSharedValue(100);
  const y = useSharedValue(100);
  const initX = useSharedValue(0);
  const initY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      initX.value = x.value;
      initY.value = y.value;
    })
    .onUpdate((event) => {
      x.value = initX.value + event.translationX;
      y.value = initY.value + event.translationY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        {/* 삭제 버튼 */}
        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>×</Text>
        </Pressable>

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { fontSize, color, backgroundColor, fontFamily },
          ]}
          value={text}
          onChangeText={onChangeText}
          onFocus={() => onFocus(id)}
          placeholder="텍스트 입력"
          placeholderTextColor={Colors.darkGray}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    zIndex: 10,
  },
  input: {
    padding: 20,
    borderRadius: 8,
    minWidth: 180,
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "red",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
});
