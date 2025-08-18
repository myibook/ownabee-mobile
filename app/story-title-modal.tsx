import { styles } from "@/src/styles/story-title-modal/styles.module";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface StoryTitleModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function StoryTitleModal({
  isVisible,
  onClose,
}: StoryTitleModalProps) {
  const [title, setTitle] = useState("");

  return (
    <Modal animationType="fade" transparent visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>📖 스토리북 제목을 입력하세요</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="What's the title of your storybook?"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <Link
                href={{
                  pathname: "/select-genre",
                  params: { title },
                }}
                style={[styles.saveButton, { opacity: title.trim() ? 1 : 0.5 }]}
                disabled={!title.trim()}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>시작</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
