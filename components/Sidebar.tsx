import { styles } from '@/src/styles/components/Sidebar/styles.module';
import { TextData } from '@/types/audiobook';
import { Portal, PortalProvider } from '@gorhom/portal';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type SidebarProps = {
  texts: TextData[];
  onAddTextToCanvas: (text: TextData) => void;
  setShowDragOverlay: (show: boolean) => void;
};

const DRAG_OFFSET_X = -200;
const DRAG_OFFSET_Y = -80;

const DraggableSidebarItem = ({
  text,
  onAddTextToCanvas,
  setShowDragOverlay,
}: {
  text: TextData;
  onAddTextToCanvas: (text: TextData) => void;
  setShowDragOverlay: (show: boolean) => void;
}) => {
  const isPressed = useSharedValue(false);
  const isAddingToCanvas = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const showPortal = useSharedValue(false);
  const portalLayout = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const itemRef = useAnimatedRef<View>();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }],
    backgroundColor: '#297F5DFF',
    opacity: showPortal.value ? 0 : 1,
  }));

  const portalStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: portalLayout.value.x + offset.value.x },
      { translateY: portalLayout.value.y + offset.value.y },
      { scale: withSpring(isPressed.value ? 1.1 : 1) },
    ],
    backgroundColor: '#126544B7',
    opacity: showPortal.value ? 1 : 0,
    width: portalLayout.value.width,
    height: portalLayout.value.height,
    position: 'absolute',
    zIndex: 1000,
  }));

  // only show drag overlay when near canvas
  useAnimatedReaction(
    () => offset.value.x < DRAG_OFFSET_X && offset.value.y > DRAG_OFFSET_Y,
    (isDragging, wasDragging) => {
      if (isDragging !== wasDragging) {
        runOnJS(setShowDragOverlay)(isDragging);
      }
    },
    []
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isPressed.value = true;

      const layout = measure(itemRef);

      if (layout) {
        portalLayout.value = {
          x: layout.pageX - 16, // adjust for screen padding
          y: layout.pageY - 16,
          width: layout.width,
          height: layout.height,
        };
      }

      showPortal.value = true;
    })
    .onUpdate(e => {
      offset.value = { x: e.translationX, y: e.translationY };
    })
    .onEnd(() => {
      // 드래그가 끝나면 캔버스에 추가하는 함수를 호출
      // only added if near canvas (estimated threshold)
      if (offset.value.x < DRAG_OFFSET_X && offset.value.y > DRAG_OFFSET_Y) {
        isAddingToCanvas.value = true;
        runOnJS(onAddTextToCanvas)(text);
      }
    })
    .onFinalize(() => {
      // 애니메이션을 원래 위치로 되돌림
      // skip animation if adding to canvas
      if (!isAddingToCanvas.value) {
        offset.value = withSpring({ x: 0, y: 0 }, { mass: 0.5 });
      }
      isPressed.value = false;
      showPortal.value = false;
      runOnJS(setShowDragOverlay)(false);
    });

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          ref={itemRef}
          style={[styles.sidebarItem, styles.enabledItem, animatedStyles]}
        >
          <Text style={styles.sidebarText} numberOfLines={15}>
            {text.content}
          </Text>
        </Animated.View>
      </GestureDetector>

      <Portal>
        <Animated.View style={[styles.sidebarItem, styles.enabledItem, portalStyles]}>
          <Text style={styles.sidebarText} numberOfLines={15}>
            {text.content}
          </Text>
        </Animated.View>
      </Portal>
    </>
  );
};

export default function Sidebar({ texts, onAddTextToCanvas, setShowDragOverlay }: SidebarProps) {
  return (
    <PortalProvider>
      <View style={styles.sidebarContainer}>
        <ScrollView>
          {texts.map((text, index) => {
            if (index === 0) {
              return (
                <DraggableSidebarItem
                  key={text.id}
                  text={text}
                  onAddTextToCanvas={onAddTextToCanvas}
                  setShowDragOverlay={setShowDragOverlay}
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
    </PortalProvider>
  );
}
