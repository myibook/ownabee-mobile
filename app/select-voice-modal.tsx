import VoiceSelectGrid from "@/components/VoiceSelectGrid";
import { styles } from "@/src/styles/select-voice-modal/styles.module";
import { mockVoices } from "@/mocks/voices";

import { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

interface VoiceSelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function VoiceSelectorModal({
  isVisible,
  onClose,
}: VoiceSelectorModalProps) {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>("2");

  return (
    <Modal animationType="fade" transparent visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select a voice</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <VoiceSelectGrid
            voices={mockVoices}
            selectedVoiceId={selectedVoiceId}
            onSelectVoice={setSelectedVoiceId}
          />
        </View>
      </View>
    </Modal>
  );
}
