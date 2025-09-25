import { styles } from '@/src/styles/components/DraggableItem/styles.module';
import { getCachedImageSource } from '@/utils/image';
import React, { useEffect } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
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
    x?: number;
    y?: number;
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
  setShowSnapOverlay?: (show: boolean) => void;
};

const MIN_SIZE = 50;

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
  setShowSnapOverlay,
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
  const height = useSharedValue(initialHeight || 100);
  const itemLayout = useSharedValue({ width: 0, height: 0 });

  const aspectRatioSV = useSharedValue(aspectRatio || undefined);

  const fontWeightSV = useSharedValue(fontWeight || 'normal');
  const fontStyleSV = useSharedValue(fontStyle || 'normal');
  const colorSV = useSharedValue(color);
  const backgroundColorSV = useSharedValue(backgroundColor || '');

  const isSnappedToCenter = useSharedValue(false);

  useEffect(() => {
    translateX.value = initialX;
    translateY.value = initialY;
    width.value = initialWidth;
    height.value = initialHeight || 100;
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
    initialHeight,
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
  const offsetW = useSharedValue(0);
  const offsetH = useSharedValue(0);
  const initialCenterX = useSharedValue(0);
  const initialCenterY = useSharedValue(0);
  const canvasXMidpoint = canvasWidth / 2;
  const canvasXMidpointThreshold = canvasWidth * 0.03;

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate(event => {
      'worklet';
      const itemWidth = width.value;

      const itemHeight = itemType === 'image'
        ? (aspectRatioSV.value ? width.value / aspectRatioSV.value : height.value)
        : itemLayout.value.height;

      const newX = offsetX.value + event.translationX;
      const newY = offsetY.value + event.translationY;
      const itemXMidpoint = newX + itemWidth / 2;
      
      // snap to x-axis center if within threshold
      const shouldSnap = 
        itemXMidpoint > (canvasXMidpoint - canvasXMidpointThreshold) &&
        itemXMidpoint < (canvasXMidpoint + canvasXMidpointThreshold);

      isSnappedToCenter.value = shouldSnap;

      if (shouldSnap) {
        translateX.value = canvasXMidpoint - itemWidth / 2;
      } else {
        translateX.value = Math.max(0, Math.min(newX, canvasWidth - itemWidth));
      }
      translateY.value = Math.max(0, Math.min(newY, canvasHeight - itemHeight));
    })
    .onEnd(() => {
      isSnappedToCenter.value = false;
      runOnJS(onDragEnd)({
        x: translateX.value,
        y: translateY.value,
      });
    })
    .maxPointers(1);

  // toggle snap overlay
  useAnimatedReaction(
    () => {
      return {
        isSnapped: isSnappedToCenter.value
      };
    },
    (current, previous) => {
      if (setShowSnapOverlay) {
        const shouldShowOverlay = current.isSnapped;
        if (!previous || previous.isSnapped !== current.isSnapped) {
          runOnJS(setShowSnapOverlay)(shouldShowOverlay);
        }
      }
    }
  );

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      'worklet';
      offsetW.value = width.value;
      offsetH.value = height.value;
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      
      const itemHeight = itemType === 'image'
        ? (aspectRatioSV.value ? width.value / aspectRatioSV.value : height.value)
        : itemLayout.value.height;

      initialCenterX.value = translateX.value + width.value / 2;
      initialCenterY.value = translateY.value + itemHeight / 2;
    })
    .onUpdate(event => {
      'worklet';
      const newWidth = offsetW.value * event.scale;
      let clampedWidth = Math.max(MIN_SIZE, newWidth);

      let newHeight;
      if (aspectRatioSV.value) {
        newHeight = clampedWidth / aspectRatioSV.value;
      } else {
        const currentAspectRatio = offsetW.value / offsetH.value;
        newHeight = clampedWidth / currentAspectRatio;
      }
      
      const maxWidthFromLeft = initialCenterX.value * 2;
      const maxWidthFromRight = (canvasWidth - initialCenterX.value) * 2;
      
      let maxWidthFromTop;
      let maxWidthFromBottom;
      const aspectRatio = aspectRatioSV.value || (offsetW.value / offsetH.value);
      maxWidthFromTop = (initialCenterY.value * 2) * aspectRatio;
      maxWidthFromBottom = ((canvasHeight - initialCenterY.value) * 2) * aspectRatio;

      const maxAllowedWidth = Math.min(
        maxWidthFromLeft,
        maxWidthFromRight,
        maxWidthFromTop,
        maxWidthFromBottom
      );
      
      if (clampedWidth > maxAllowedWidth) {
        clampedWidth = maxAllowedWidth;
        if (aspectRatioSV.value) {
          newHeight = clampedWidth / aspectRatioSV.value;
        } else {
          const currentAspectRatio = offsetW.value / offsetH.value;
          newHeight = clampedWidth / currentAspectRatio;
        }
      }
      width.value = clampedWidth;
      if (itemType === 'image') height.value = newHeight;

      const finalX = initialCenterX.value - clampedWidth / 2;
      const finalY = initialCenterY.value - newHeight / 2;
      translateX.value = finalX;
      translateY.value = finalY;
    })
    .onEnd(() => {
      'worklet';
      if (onResizeEnd) {
        const finalFontSize = dynamicFontSize.value;
        runOnJS(onResizeEnd)({
          x: translateX.value,
          y: translateY.value,
          width: width.value,
          height: itemType === 'image' ? height.value : itemLayout.value.height,
          originalWidth: width.value,
          baseFontSize: finalFontSize,
        });
      }
    });

  const resizeLeftGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      offsetW.value = width.value;
      offsetX.value = translateX.value;
    })
    .onUpdate(event => {
      'worklet';
      const newX = offsetX.value + event.translationX;
      const clampedX = Math.max(0, newX);
      const adjustedTranslation = clampedX - offsetX.value;
      const clampedWidth = Math.max(MIN_SIZE, offsetW.value - adjustedTranslation);
      
      translateX.value = clampedX;
      width.value = clampedWidth;
      originalWidthSV.value = clampedWidth;
    })
    .onEnd(() => {
      'worklet';
      if (onResizeEnd) {
        const newBottomY = translateY.value + itemLayout.value.height;
        if (newBottomY > canvasHeight) {
          translateY.value = canvasHeight - itemLayout.value.height;
        }
        runOnJS(onResizeEnd)({
          x: translateX.value,
          y: translateY.value,
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
      const maxWidthFromRightEdge = canvasWidth - translateX.value;
      const clampedWidth = Math.max(MIN_SIZE, Math.min(newWidth, maxWidthFromRightEdge));

      width.value = clampedWidth;
      originalWidthSV.value = clampedWidth;
    })
    .onEnd(() => {
      'worklet';
      if (onResizeEnd) {
        const newBottomY = translateY.value + itemLayout.value.height;
        if (newBottomY > canvasHeight) {
          translateY.value = canvasHeight - itemLayout.value.height;
        }
        runOnJS(onResizeEnd)({
          y: translateY.value,
          width: width.value,
          height: itemLayout.value.height,
          originalWidth: originalWidthSV.value,
        });
      }
    });

  const resizeBottomGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      offsetH.value = height.value;
    })
    .onUpdate(event => {
      'worklet';
      const newHeight = offsetH.value + event.translationY;
      const maxHeight = canvasHeight - translateY.value;
      const clampedHeight = Math.max(MIN_SIZE, Math.min(newHeight, maxHeight));

      height.value = clampedHeight;
    })
    .onEnd(() => {
      'worklet';
      if (onResizeEnd) {
        runOnJS(onResizeEnd)({
          height: height.value,
        });
      }
    });

  const composedGesture = Gesture.Race(dragGesture, pinchGesture, tapGesture);

  const selectionStyle = useAnimatedStyle(() => {
    return {
      outlineWidth: withTiming(isSelected ? 2 : 0),
      outlineColor: '#007AFF',
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

    if (aspectRatioSV.value) {
      const calculatedHeight = width.value / aspectRatioSV.value;
      return {
        width: width.value,
        height: calculatedHeight,
      };
    } else {
      return {
        width: width.value,
        height: height.value,
      };
    }
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
                  source={getCachedImageSource(imageUrl)}
                  style={{ width: '100%', height: '100%', borderRadius: 8 }}
                  transition={null}
                  contentFit={aspectRatio ? 'cover' : 'fill'}
                />
              ) : (
                <Text style={styles.imagePlaceholderText}>Generate Image</Text>
              )}
            </Pressable>
          )}

          {isResizable && isSelected && (
            <>
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
                <>
                  {!aspectRatio && (
                    <>
                      <GestureDetector gesture={resizeRightGesture}>
                        <View style={[styles.resizeHandleHorizontal, styles.rightHandle]} hitSlop={20} />
                      </GestureDetector>
                      <GestureDetector gesture={resizeBottomGesture}>
                        <View style={[styles.resizeHandleVertical, styles.bottomHandle]} hitSlop={20} />
                      </GestureDetector>
                    </>
                  )}
                  <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={onDeleteImagePress}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}