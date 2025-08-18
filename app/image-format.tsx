import PageThumbnail from "@/components/PageThumbnail";
import { Colors } from "@/constants/Colors";
import { useStory } from "@/context/story";
import { PageData } from "@/types/audiobook";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useAuth } from "@/context/auth";
import { savePagesToServer } from "@/services/service";
import { styles } from "@/src/styles/image-format/styles.module";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import TopBar from "@/components/TopBar";

type LayoutStyleKey =
  | "imageTopTextBottom"
  | "imageLeftTextRight"
  | "textLeftImageRight"
  | "imageLeftTextRightVert";

const formatOptions: { id: number; layout: LayoutStyleKey }[] = [
  { id: 1, layout: "imageTopTextBottom" },
  { id: 2, layout: "imageLeftTextRight" },
  { id: 3, layout: "textLeftImageRight" },
  { id: 4, layout: "imageLeftTextRightVert" },
];

const renderFormatPreview = (layout: string) => {
  switch (layout) {
    case "imageTopTextBottom":
      return (
        <View style={styles.verticalLayout}>
          <View style={styles.layoutImageBox}>
            <AntDesign name="picture" size={20} color={Colors.mediumPurple} />
          </View>
          <View style={styles.textBox}>
            <MaterialCommunityIcons
              name="text"
              size={20}
              color={Colors.silverMedium}
            />
          </View>
        </View>
      );

    case "imageLeftTextRight":
      return (
        <View style={styles.horizontalLayout}>
          <View style={styles.layoutImageBox}>
            <AntDesign name="picture" size={20} color={Colors.mediumPurple} />
          </View>
          <View style={styles.textBox}>
            <MaterialCommunityIcons
              name="text"
              size={20}
              color={Colors.silverMedium}
            />
          </View>
        </View>
      );

    case "textLeftImageRight":
      return (
        <View style={styles.horizontalLayout}>
          <View style={styles.textBox}>
            <MaterialCommunityIcons
              name="text"
              size={20}
              color={Colors.silverMedium}
            />
          </View>
          <View style={styles.layoutImageBox}>
            <AntDesign name="picture" size={20} color={Colors.mediumPurple} />
          </View>
        </View>
      );

    case "imageLeftTextRightVert":
      return (
        <View style={styles.gridLayout}>
          <View style={styles.gridRow}>
            <View style={styles.imageBoxSmall}>
              <AntDesign name="picture" size={14} color={Colors.mediumPurple} />
            </View>
            <View style={styles.textBoxSmall}>
              <MaterialCommunityIcons
                name="text"
                size={14}
                color={Colors.silverMedium}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.textBoxSmall}>
              <MaterialCommunityIcons
                name="text"
                size={14}
                color={Colors.silverMedium}
              />
            </View>
            <View style={styles.imageBoxSmall}>
              <AntDesign name="picture" size={14} color={Colors.mediumPurple} />
            </View>
          </View>
        </View>
      );

    default:
      return null;
  }
};

export default function ImageFormatScreen() {
  const { user } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<number | null>(1);
  const { pages, setPages } = useStory();
  const currentText = pages[selectedIndex]?.text || "";
  const currentLayout = pages[selectedIndex]?.layout || "";
  const [isSaving, setIsSaving] = useState(false);

  const saveBook = async (currentData: PageData[]) => {
    try {
      setIsSaving(true);
      await savePagesToServer(currentData);
      setPages([{ text: "", layout: "imageTopTextBottom", pageNum: 1 }]);
      router.push({
        pathname: "/(tabs)",
      });
    } catch (e) {
      console.error(
        `image-format : saveData 저장 실패 userId = ${user?.id} error = ${e}`
      );
    } finally {
      setIsSaving(false);
    }
  };
  const updateLayoutForCurrentPage = (
    layout: string,
    pageIndex: number,
    id: number
  ) => {
    setSelectedFormat(id);
    setPages((prevPages) =>
      prevPages.map((page, idx) =>
        idx === pageIndex ? { ...page, layout } : page
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <TopBar
        backHref="/grammar-check"
        title="✏️"
        rightButtons={[
          {
            text: "I’m done adding images",
            href: "/generate-image-complete",
            color: Colors.purple,
            fontColor: Colors.black,
          },
          {
            text: "Save",
            color: Colors.lightBlue,
            isLoading: isSaving,
            onPress: async () => await saveBook(pages),
          },
        ]}
      />

      {/* 좌측: 페이지 썸네일 리스트 */}
      <View style={styles.sidebar}>
        <ScrollView
          style={{
            width: 120,
            padding: 12,
            marginTop: 70,
          }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {pages.map((page, index) => (
            <PageThumbnail
              key={index}
              content={page}
              isSelected={selectedIndex === index}
              onPress={() => setSelectedIndex(index)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 중앙 콘텐츠 미리보기 */}
      <View style={styles.main}>
        <View style={styles.textInputHeader}>
          <Text style={styles.lastEdit}>
            Last edited | {new Date().toLocaleString()}
          </Text>
          <Text style={styles.pageInfo}>
            Page {selectedIndex + 1} of {pages.length}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: Colors.lightGray,
            width: "100%",
            marginTop: 10,
            marginBottom: 20,
          }}
        />
        {currentLayout === "imageTopTextBottom" && (
          <>
            <View style={styles.imageBoxFormat}>
              <Image
                source={require("./../assets/images/picture.png")}
                style={styles.imageIcon}
              />
            </View>
            <Text style={styles.storyText}>{currentText}</Text>
          </>
        )}

        {currentLayout === "imageLeftTextRight" && (
          <View style={styles.row}>
            <View style={styles.imageBox}>
              <Image
                source={require("./../assets/images/picture.png")}
                style={styles.imageIcon}
              />
            </View>
            <Text style={styles.storyText}>{currentText}</Text>
          </View>
        )}

        {currentLayout === "textLeftImageRight" && (
          <View style={styles.row}>
            <Text style={styles.storyText}>{currentText}</Text>
            <View style={styles.imageBox}>
              <AntDesign name="picture" size={24} color={Colors.mediumPurple} />
            </View>
          </View>
        )}

        {currentLayout === "imageLeftTextRightVert" && (
          <View style={styles.column}></View>
        )}
      </View>

      {/* 오른쪽 포맷 선택 영역 */}
      <View style={styles.formatList}>
        {formatOptions.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.formatOption,
              selectedFormat === opt.id && styles.selectedFormat,
              //   && styles[opt.layout],
            ]}
            onPress={() =>
              updateLayoutForCurrentPage(opt.layout, selectedIndex, opt.id)
            }
          >
            {renderFormatPreview(opt.layout)}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
