import { styles } from '@/src/styles/components/DraggableItem/styles.module';
import React, { useEffect } from 'react';
import { Image, LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type DraggableItemProps = {
  itemType: 'text' | 'image';
  content?: string;
  onImagePress?: () => void;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight?: number;
  originalWidth?: number;
  aspectRatio?: number;
  isResizable?: boolean;
  onDragEnd: (position: { x: number; y: number }) => void;
  onResizeEnd?: (updates: {
    width?: number;
    height?: number;
    originalWidth?: number;
    baseFontSize?: number;
  }) => void;
  canvasWidth: number;
  canvasHeight: number;
  isSelected: boolean;
  onTap: () => void;
  baseFontSize?: number;
  minFontSize?: number;
  onRollbackPress?: () => void;
  onDeleteImagePress?: () => void;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
  imageUrl?: string;
  badgeText?: string;
};

const MIN_WIDTH = 50;

export default function DraggableItem({
  itemType,
  content,
  onImagePress,
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  originalWidth,
  baseFontSize = 16,
  minFontSize = 10,
  aspectRatio,
  isResizable = false,
  onDragEnd,
  onResizeEnd,
  canvasWidth,
  canvasHeight,
  isSelected,
  onTap,
  onRollbackPress,
  onDeleteImagePress,
  fontWeight,
  fontStyle,
  color = 'black',
  backgroundColor,
  imageUrl,
  badgeText,
}: DraggableItemProps) {
  const initialWidthSV = useSharedValue(initialWidth);

  useEffect(() => {
    initialWidthSV.value = initialWidth;
  }, [initialWidth]);

  // 폰트 크기 계산의 기준이 될 originalWidth를 위한 Shared Value
  const originalWidthSV = useSharedValue(originalWidth || initialWidth);
  const baseFontSizeSV = useSharedValue(baseFontSize);

  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const width = useSharedValue(initialWidth);
  const height = useSharedValue(initialHeight);
  const itemLayout = useSharedValue({ width: 0, height: 0 });

  const aspectRatioSV = useSharedValue(aspectRatio);

  const fontWeightSV = useSharedValue(fontWeight || 'normal');
  const fontStyleSV = useSharedValue(fontStyle || 'normal');
  const colorSV = useSharedValue(color);
  const backgroundColorSV = useSharedValue(backgroundColor || '');

  useEffect(() => {
    translateX.value = initialX;
    translateY.value = initialY;
    width.value = initialWidth;
    originalWidthSV.value = originalWidth || initialWidth;
    baseFontSizeSV.value = baseFontSize;
    aspectRatioSV.value = aspectRatio;
    fontWeightSV.value = fontWeight || 'normal';
    fontStyleSV.value = fontStyle || 'normal';
    colorSV.value = color;
    backgroundColorSV.value = backgroundColor || '';
  }, [
    initialX,
    initialY,
    initialWidth,
    originalWidth,
    baseFontSize,
    aspectRatio,
    fontWeight,
    fontStyle,
    color,
    backgroundColor,
  ]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } = event.nativeEvent.layout;
    itemLayout.value = { width: layoutWidth, height: layoutHeight };
  };

  const dynamicFontSize = useDerivedValue(() => {
    'worklet';
    if (itemType === 'text' && originalWidthSV.value > 0) {
      const sizeRatio = width.value / originalWidthSV.value;
      const calculatedSize = baseFontSize * sizeRatio;
      return Math.max(calculatedSize, minFontSize);
    }
    return baseFontSize;
  }, [baseFontSize, minFontSize]);

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      fontSize: dynamicFontSize.value,
      lineHeight: dynamicFontSize.value * 1.4,
      fontWeight: fontWeightSV.value,
      fontStyle: fontStyleSV.value,
      color: colorSV.value,
    };
  });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onTap)();
  });

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate(event => {
      'worklet';
      const itemWidth = width.value;

      const itemHeight =
        itemType === 'image' && aspectRatioSV.value
          ? width.value / aspectRatioSV.value
          : itemLayout.value.height;

      const newX = offsetX.value + event.translationX;
      const newY = offsetY.value + event.translationY;

      translateX.value = Math.max(0, Math.min(newX, canvasWidth - itemWidth));
      translateY.value = Math.max(0, Math.min(newY, canvasHeight - itemHeight));
    })
    .onEnd(() => {
      runOnJS(onDragEnd)({
        x: translateX.value,
        y: translateY.value,
      });
    });

  const offsetW = useSharedValue(0);
  // 1. 우측 하단 핸들 (스케일링)
  const resizeBottomRightGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      offsetW.value = width.value;
    })
    .onUpdate(event => {
      'worklet';
      const newWidth = offsetW.value + event.translationX;
      const maxWidth = canvasWidth - translateX.value;
      width.value = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));
    })
    .onEnd(() => {
      'worklet';
      if (onResizeEnd) {
        const finalFontSize = dynamicFontSize.value;
        runOnJS(onResizeEnd)({
          width: width.value,
          height: itemLayout.value.height,
          originalWidth: width.value,
          baseFontSize: finalFontSize,
        });
      }
    });

  const resizeLeftGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
    })
    .onUpdate(event => {
      'worklet';
      const newWidth = offsetW.value - event.translationX;
      originalWidthSV.value = newWidth;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(onDragEnd)({ x: translateX.value, y: translateY.value });
      if (onResizeEnd) {
        runOnJS(onResizeEnd)({
          width: width.value,
          height: itemLayout.value.height,
          originalWidth: originalWidthSV.value,
        });
      }
    });

  const resizeRightGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      offsetW.value = width.value;
    })
    .onUpdate(event => {
      'worklet';
      const newWidth = offsetW.value + event.translationX;
      const maxWidth = canvasWidth - translateX.value;
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, maxWidth));

      width.value = clampedWidth;
      originalWidthSV.value = clampedWidth;
    })
    .onEnd(() => {
      'worklet';
      if (onResizeEnd) {
        runOnJS(onResizeEnd)({
          width: width.value,
          height: itemLayout.value.height,
          originalWidth: originalWidthSV.value,
        });
      }
    });

  const composedGesture = Gesture.Race(dragGesture, tapGesture);

  const selectionStyle = useAnimatedStyle(() => {
    return {
      borderWidth: withTiming(isSelected ? 2 : 0),
      borderColor: '#007AFF',
      borderRadius: 8,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    'worklet';
    if (itemType === 'text') {
      return { width: width.value, height: 'auto' };
    }

    const calculatedHeight = aspectRatioSV.value ? width.value / aspectRatioSV.value : undefined;
    return {
      width: width.value,
      height: calculatedHeight ? calculatedHeight : 'auto',
    };
  });

  const textViewAnimatedStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColorSV.value || 'transparent' };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[animatedContentStyle, selectionStyle]} onLayout={handleLayout}>
          {badgeText && (
            <View
              style={{
                position: 'absolute',
                top: -14,
                right: -14,
                backgroundColor: '#111827',
                borderRadius: 12,
                paddingHorizontal: 6,
                height: 24,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30,
                borderWidth: 1,
                borderColor: 'white',
              }}
              pointerEvents="none"
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>{badgeText}</Text>
            </View>
          )}
          {itemType === 'text' ? (
            <Animated.View style={[styles.textView, textViewAnimatedStyle]}>
              <Animated.Text style={textAnimatedStyle}>{content}</Animated.Text>
            </Animated.View>
          ) : (
            <Pressable style={styles.imagePlaceholder} onPress={onImagePress}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: '100%', height: '100%', borderRadius: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.imagePlaceholderText}>Generate Image</Text>
              )}
            </Pressable>
          )}

          {isResizable && isSelected && (
            <>
              {/* Invisible pad to enlarge touch target */}
              <GestureDetector gesture={resizeBottomRightGesture}>
                <View style={styles.resizeHandleBottomRightPad} />
              </GestureDetector>
              {/* Visible handle */}
              <View style={styles.resizeHandleBottomRight} />

              {/* 텍스트 아이템일 때만 좌우 핸들 표시 */}
              {itemType === 'text' && (
                <>
                  <GestureDetector gesture={resizeLeftGesture}>
                    <View style={[styles.resizeHandleHorizontal, styles.leftHandle]} />
                  </GestureDetector>
                  <GestureDetector gesture={resizeRightGesture}>
                    <View style={[styles.resizeHandleHorizontal, styles.rightHandle]} />
                  </GestureDetector>
                  <Pressable style={styles.rollbackButton} onPress={onRollbackPress}>
                    <Text style={styles.rollbackButtonText}>X</Text>
                  </Pressable>
                </>
              )}
              {/* 이미지일 때는 삭제 버튼 */}
              {itemType === 'image' && (
                <Pressable
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={onDeleteImagePress}
                >
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </Pressable>
              )}
            </>
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
