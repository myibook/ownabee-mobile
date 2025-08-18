import { fetchAudioBookDetail } from "@/services/service";
import { styles } from "@/src/styles/story-detail/styles.module";
import { AudioBookDetail } from "@/types/audiobook";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import VoiceSelectorModal from "./select-voice-modal";

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<AudioBookDetail | null>(null);

  const [isSelectVoiceModalVisible, setIsSelectVoiceModalVisible] = useState<boolean>(false);
  
  const onSelectVoiceModalClose = () => setIsSelectVoiceModalVisible(false);
  const onSelectVoiceModalOpen = () => setIsSelectVoiceModalVisible(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const detail = await fetchAudioBookDetail(id);
        setBook(detail);
      } catch (err) {
        console.error("📕 Fetch error:", err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href={"/(tabs)/my-shelf"}>
          <Text style={styles.back}>← Back</Text>
        </Link>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Left: Book cover */}
        <View style={styles.coverWrapper}>
          <Image
            source={require("./../assets/images/zombie.png")}
            style={styles.cover}
          />
          <Text style={styles.pageCount}>Page 1/{book?.pageCount}</Text>
        </View>

        {/* Right: Story info */}
        <View style={styles.infoPanel}>
          <View>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.text}>{book?.title}</Text>

            <Text style={styles.label}>Created by</Text>
            <Text style={styles.text}>{book?.createdBy}</Text>

            <Text style={styles.label}>Reading level</Text>
            <Text style={styles.text}>{book?.readingLevel}</Text>

            <Text style={styles.label}>Summary</Text>
            <Text style={styles.text}>{book?.summary}</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.readButton} onPress={onSelectVoiceModalOpen}>
              <Text style={styles.readButtonText}>Start reading</Text>
            </TouchableOpacity>
            <Link style={styles.addButton} href={"/(tabs)/my-shelf"}>
              <Text style={styles.addButtonText}>Add to list</Text>
            </Link>
          </View>
        </View>
      </View>
      <VoiceSelectorModal
        isVisible={isSelectVoiceModalVisible}
        onClose={onSelectVoiceModalClose}
      />
    </View>
  );
}
