import TopBar from "@/components/TopBar";
import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/cover-editor/styles.module";
import DraggableTextWithStyle from "@/utils/DraggableTextWithStyle";

import AntDesign from "@expo/vector-icons/AntDesign";
import { Image, View } from "react-native";

export default function CoverEditorScreen() {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <TopBar
        backHref="/grammar-check"
        title="✏️"
        rightButtons={[
          {
            text: "I’m done adding images",
            href: "/cover-complete",
            color: Colors.purple,
            fontColor: Colors.black,
          },
        ]}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 100,
        }}
      >
        {/* 중앙 콘텐츠 미리보기 */}
        <View style={styles.main}>
          <Image
            source={require("../assets/images/zombie.png")}
            style={styles.image}
            resizeMode="stretch"
          />
          <DraggableTextWithStyle />
        </View>
        {/* 우측: 이미지 리스트 */}
        <View style={styles.formatList}>
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
              backgroundColor: Colors.softPurple,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign name="picture" size={30} color={Colors.mediumPurple} />
          </View>
        </View>
      </View>
    </View>
  );
}
