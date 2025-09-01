import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector, TextInput } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function DraggableTextInput({
  id,
  text,
  triggerSignal,
  onChangeText,
  onFocus,
  onDelete,
  onPositionChange,
  initialX,
  initialY,
  fontSize,
  color,
  backgroundColor,
  fontFamily,
  parentWidth,
  parentHeight,
  autoFocus,
  title,
}: {
  id: number;
  text: string;
  onChangeText: (text: string) => void;
  onFocus: (id: number) => void;
  onDelete: () => void;
  onPositionChange?: (id: number, x: number, y: number) => void;
  initialX?: number;
  initialY?: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  fontFamily: string;
  parentWidth: number;
  triggerSignal?: number;
  parentHeight: number;
  autoFocus: boolean;
  title: string;
}) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const x = useSharedValue(initialX ?? 100);
  const y = useSharedValue(initialY ?? 100);
  const initX = useSharedValue(0);
  const initY = useSharedValue(0);
  const inputWidth = useSharedValue(0);
  const inputHeight = useSharedValue(0);

  useEffect(() => {
    inputRef.current?.blur();
    setIsFocused(false);
  }, [triggerSignal]);

  const reportPosition = (newX: number, newY: number) => {
    if (onPositionChange) {
      onPositionChange(id, newX, newY);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus(id);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      initX.value = x.value;
      initY.value = y.value;
    })
    .onUpdate(event => {
      const nextX = initX.value + event.translationX;
      const nextY = initY.value + event.translationY;

      // 제한 범위 계산
      const maxX = parentWidth - inputWidth.value;
      const maxY = parentHeight - inputHeight.value;

      // 경계 안에서만 움직이게 제한
      const boundedX = Math.min(Math.max(nextX, 0), maxX);
      const boundedY = Math.min(Math.max(nextY, 0), maxY);

      x.value = boundedX;
      y.value = boundedY;

      // 위치 변경 콜백 호출
      runOnJS(reportPosition)(boundedX, boundedY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        {/* 삭제 버튼 - 포커스된 경우에만 표시 */}
        {isFocused && (
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>×</Text>
          </Pressable>
        )}

        <TextInput
          ref={inputRef}
          style={[styles.input, { fontSize, color, backgroundColor, fontFamily }]}
          value={text}
          autoFocus={autoFocus}
          autoCorrect={false} // disables autocorrect / spelling suggestions
          spellCheck={false} // Android only: disables spell check
          autoCapitalize="none" // prevents automatic capitalization
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={title}
          placeholderTextColor={Colors.darkGray}
          onLayout={e => {
            const { width, height } = e.nativeEvent.layout;
            inputWidth.value = width;
            inputHeight.value = height;
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  input: {
    padding: 20,
    borderRadius: 8,
    minWidth: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});
