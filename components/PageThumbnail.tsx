// components/PageThumbnail.tsx
import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/components/page-thumbnail/styles.module";
import { PageThumbnailProps } from "@/types/audiobook";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Text, View } from "react-native";

export default function PageThumbnail({
  content,
  isSelected,
  onPress,
}: PageThumbnailProps) {
  const { layout, text } = content;

  const renderLayout = () => {
    switch (layout) {
      case "imageTopTextBottom":
        return (
          <View style={styles.vertical}>
            <View style={styles.image}>
              <AntDesign name="picture" size={20} color={Colors.mediumPurple} />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.textPreview}>{text?.slice(0, 40)}</Text>
            </View>
          </View>
        );
      case "imageLeftTextRight":
        return (
          <View style={styles.horizontalLayout}>
            <View style={styles.image}>
              <AntDesign name="picture" size={20} color={Colors.mediumPurple} />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.textPreview}>{text?.slice(0, 40)}</Text>
            </View>
          </View>
        );
      case "textLeftImageRight":
        return (
          <View style={styles.horizontalLayout}>
            <View style={styles.textBox}>
              <Text style={styles.textPreview}>{text?.slice(0, 40)}</Text>
            </View>
            <View style={styles.image}>
              <AntDesign name="picture" size={20} color={Colors.mediumPurple} />
            </View>
          </View>
        );
      case "imageLeftTextRightVert":
        return (
          <View style={styles.gridLayout}>
            <View style={styles.gridRow}>
              <View style={styles.imageBoxSmall}>
                <AntDesign
                  name="picture"
                  size={14}
                  color={Colors.mediumPurple}
                />
              </View>
              <View style={styles.textBoxSmall}>
                <MaterialCommunityIcons
                  name="text"
                  size={14}
                  color={Colors.mediumPurple}
                />
              </View>
            </View>
            <View style={styles.gridRow}>
              <View style={styles.textBoxSmall}>
                <MaterialCommunityIcons
                  name="text"
                  size={14}
                  color={Colors.mediumPurple}
                />
              </View>
              <View style={styles.imageBoxSmall}>
                <AntDesign
                  name="picture"
                  size={14}
                  color={Colors.mediumPurple}
                />
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.vertical}>
            <View style={styles.textBox}>
              <Text style={styles.textPreview}>{text?.slice(0, 20)}</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View
      onTouchEnd={onPress}
      style={[
        styles.container,
        isSelected && { borderColor: Colors.lightBlue, borderWidth: 2 },
      ]}
    >
      {renderLayout()}
    </View>
  );
}
