import { styles } from '@/src/styles/components/Sidebar/styles.module';
import { TextData } from '@/types/audiobook';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type SidebarProps = {
  texts: TextData[];
  onAddTextToCanvas: (text: TextData) => void;
};

const DraggableSidebarItem = ({
  text,
  onAddTextToCanvas,
}: {
  text: TextData;
  onAddTextToCanvas: (text: TextData) => void;
}) => {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value.x },
      { translateY: offset.value.y },
      { scale: withSpring(isPressed.value ? 1.1 : 1) },
    ],
    backgroundColor: isPressed.value ? '#126544B7' : '#297F5DFF',
  }));

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onUpdate(e => {
      offset.value = { x: e.translationX, y: e.translationY };
    })
    .onEnd(() => {
      // 드래그가 끝나면 캔버스에 추가하는 함수를 호출
      runOnJS(onAddTextToCanvas)(text);
    })
    .onFinalize(() => {
      // 애니메이션을 원래 위치로 되돌림
      offset.value = withSpring({ x: 0, y: 0 });
      isPressed.value = false;
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.sidebarItem, styles.enabledItem, animatedStyles]}>
        <Text style={styles.sidebarText} numberOfLines={15}>
          {text.content}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function Sidebar({ texts, onAddTextToCanvas }: SidebarProps) {
  return (
    <View style={styles.sidebarContainer}>
      <ScrollView>
        {texts.map((text, index) => {
          if (index === 0) {
            return (
              <DraggableSidebarItem
                key={text.id}
                text={text}
                onAddTextToCanvas={onAddTextToCanvas}
              />
            );
          }
          return (
            <View key={text.id} style={[styles.sidebarItem, styles.disabledItem]}>
              <Text style={[styles.sidebarText, styles.disabledText]} numberOfLines={3}>
                {text.content}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
