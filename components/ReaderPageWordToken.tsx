import React from 'react';
import { View, Text } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { styles } from '@/src/styles/components/reader-page-wordtoken/styles.module';

export const ReaderPageWordToken: React.FC<{
  currentPositionMs: SharedValue<number>;
  text: string;
  startMs: number;
  endMs: number;
  isActiveElement: boolean;
  onPress: () => void;
  baseFontSize: number;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}> = ({
  currentPositionMs,
  text,
  startMs,
  endMs,
  isActiveElement,
  onPress,
  baseFontSize,
  fontSize,
  color,
  fontWeight,
  fontStyle
}) => {
  const fillStyle = useAnimatedStyle(() => {
    if (!isActiveElement) {
      return { width: '0%' };
    }
    const pos = currentPositionMs.value;
    // rare case where trascript word has no duration (startMs = endMs)
    // fully highlight the word when pos reaches the timestamp
    const progress = endMs === startMs 
      ? (pos >= startMs ? 1 : 0)
      : Math.max(0, Math.min(1, (pos - startMs) / (endMs - startMs)));
    return { width: `${progress * 100}%` };
  }, [isActiveElement, startMs, endMs]);

  const textStyle = {
    fontSize: fontSize,
    color: color,
    fontWeight: fontWeight,
    fontStyle: fontStyle,
  };

  const largeLineHeight = (fontWeight === 'bold' || baseFontSize > 24) ? styles.largeLineHeight : {};

  return (
    <View style={[styles.wordWrap]}>
      <Animated.View pointerEvents="none" style={[styles.wordFill, fillStyle]} />
      <Text onPress={onPress} style={[styles.word, textStyle, largeLineHeight]}>
        {text + ' '}
      </Text>
    </View>
  );
};
