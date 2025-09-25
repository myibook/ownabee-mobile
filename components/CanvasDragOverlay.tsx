import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/components/canvas-drag-overlay/styles.module';
import { View } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';

interface CanvasDragOverlayProps {
  visible: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

export default function CanvasDragOverlay({ visible, canvasWidth, canvasHeight }: CanvasDragOverlayProps) {
  if (!visible) return null;
  return (
    <>
      {/* image overlay */}
      <View
        style={[
          styles.dragOverlay,
          {
            width: canvasWidth * 0.8,
            height: canvasWidth * 0.8,
            top: canvasHeight * 0.05,
            left: canvasWidth * 0.1,
          },
        ]}
      >
        <AntDesign name="picture" size={32} color={Colors.tertiaryGray} />
      </View>
      {/* text overlay */}
      <View
        style={[
          styles.dragOverlay,
          {
            width: canvasWidth * 0.8,
            height: canvasHeight * 0.2,
            top: canvasHeight * 0.75,
            left: canvasWidth * 0.1,
          },
        ]}
      >
        <Entypo name="text" size={32} color={Colors.tertiaryGray} />
      </View>
    </>
  );
};