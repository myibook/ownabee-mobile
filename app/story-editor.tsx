import PageThumbnail from "@/components/PageThumbnail";
import RoundedButton from "@/components/RoundedButton";
import TopBar from "@/components/TopBar";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { useStory } from "@/context/story";
import { createPage, deletePage, savePagesToServer } from "@/services/service";
import { styles } from "@/src/styles/story-editor/styles.module";
import { PageData } from "@/types/audiobook";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function StoryEditorScreen() {
  const {
    pages,
    setPages,
    audioBookEditionId: globalAudioBookEditionId,
    setAudioBookEditionId,
  } = useStory();

  const { user } = useAuth();
  const { audioBookEditionId, audioBookEditionFirstPageId, title } =
    useLocalSearchParams<{
      audioBookEditionId: string;
      audioBookEditionFirstPageId: string;
      title: string;
    }>();
  const scrollRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [aiVisible, setAiVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lastSavedData, setLastSavedData] = useState<PageData[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveData = async (currentData: PageData[]) => {
    // 저장 스킵
    if (_.isEqual(currentData, lastSavedData)) {
      return;
    }
    // 중복 저장 방지
    if (isSaving) {
      return;
    }
    try {
      setIsSaving(true);
      await savePagesToServer(currentData);
      setLastSavedData(_.cloneDeep(currentData));
    } catch (e) {
      console.error(
        `story-editor : saveData 저장 실패 userId = ${user?.id} error = ${e}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (pages.length > 0 && !pages[0]?.id && audioBookEditionFirstPageId) {
      const updatedPages = [...pages];
      updatedPages[0] = {
        ...updatedPages[0],
        id: audioBookEditionFirstPageId,
      };
      setPages(updatedPages);
    }
  }, [pages, audioBookEditionFirstPageId]);

  useEffect(() => {
    if (audioBookEditionId) {
      setAudioBookEditionId(audioBookEditionId);
    }
  }, [audioBookEditionId]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // 디바운스 저장 실행, 글 작성 후 3초 후 호출
    debounceTimer.current = setTimeout(() => {
      saveData(pages);
    }, 3000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pages]);

  const handleTextChange = (text: string) => {
    const newPages = [...pages];
    newPages[selectedIndex] = { ...newPages[selectedIndex], text };
    setPages(newPages);
  };

  const addPage = async () => {
    try {
      const newPage = await createPage(
        globalAudioBookEditionId,
        pages.length + 1,
        "imageTopTextBottom"
      );

      if (!newPage?.id) {
        console.error("페이지 생성 실패");
        return;
      }

      // 새 페이지를 id 포함해서 추가
      const updatedPages = [
        ...pages,
        {
          id: newPage.id,
          text: "",
          layout: newPage.layoutType,
          pageNum: newPage.pageNum,
        },
      ];

      setPages(updatedPages);
      // 새로 생성된 페이지를 선택 상태로 반영
      setSelectedIndex(pages.length);
      // 썸네일 영역 아래로 스크롤
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("❌ addPage error:", error);
    }
  };

  const saveBook = async (currentData: PageData[]) => {
    try {
      setIsSaving(true);
      await savePagesToServer(currentData);
      setLastSavedData(_.cloneDeep(currentData));
      setPages([{ text: "", layout: "imageTopTextBottom", pageNum: 1 }]);
      router.push({
        pathname: "/(tabs)",
      });
    } catch (e) {
      console.error(
        `story-editor : saveData 저장 실패 userId = ${user?.id} error = ${e}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async (indexToDelete: number) => {
    if (pages.length === 1) {
      Alert.alert("Every story needs at least one page.");
      return;
    }
    const newPages = pages
      .filter((_, i) => i !== indexToDelete)
      .map((page, idx) => ({
        ...page,
        pageNum: idx + 1,
      }));

    setPages(newPages);

    // 선택 페이지 인덱스도 보정
    if (selectedIndex >= newPages.length) {
      setSelectedIndex(newPages.length - 1);
    } else if (indexToDelete <= selectedIndex) {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    }

    const deletedPage = pages[indexToDelete];
    if (deletedPage?.id) {
      await deletePage(deletedPage.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <TopBar
        backHref="/(tabs)"
        title={title}
        rightButtons={[
          {
            text: "I’m done writing",
            href: "/writing-complete",
            color: Colors.baseYellow,
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

      {/* page list */}
      <View style={styles.sidebar}>
        <ScrollView
          ref={scrollRef}
          style={{ width: 120, padding: 12, marginTop: 70 }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {pages.map((page, index) => (
            <View
              key={index}
              style={{ position: "relative", marginBottom: 12 }}
            >
              {/* 썸네일 */}
              <PageThumbnail
                content={page}
                isSelected={selectedIndex === index}
                onPress={() => setSelectedIndex(index)}
              />

              {/* 삭제 버튼 */}
              <Pressable
                onPress={() => handleDeletePage(index)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "#f66",
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  zIndex: 1,
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 12 }}>✕</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View style={styles.newPageButton}>
          <RoundedButton
            text="＋ New Page"
            onPress={addPage}
            color={Colors.baseBlue}
          />
        </View>
      </View>

      {/* 본문 */}
      <View style={styles.editorContainer}>
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
            marginBottom: 8,
          }}
        />
        <TextInput
          ref={textInputRef}
          value={pages[selectedIndex]?.text}
          onChangeText={handleTextChange}
          style={styles.textInput}
          placeholder="Once upon a time, there lived a bunny named Harry..."
          placeholderTextColor={Colors.quaternaryGray}
          multiline
        />
      </View>
      {/* AI Companion */}
      {aiVisible ? (
        <View style={styles.aiPanel}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>AI Companion</Text>
            <Pressable onPress={() => setAiVisible(false)}>
              <MaterialCommunityIcons
                name="close-box-outline"
                size={24}
                color={Colors.silverMedium}
              />
            </Pressable>
          </View>
          <Text style={styles.aiText}>
            ✨ What Makes a Rhyming Book?{"\n"}A rhyming book is a story that
            sounds like a song when you read it out loud...
          </Text>
        </View>
      ) : (
        <Pressable style={styles.infoIcon} onPress={() => setAiVisible(true)}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={Colors.silverMedium}
          />
        </Pressable>
      )}
    </View>
  );
}
