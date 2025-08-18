import { Colors } from "@/constants/Colors";
import { Voice } from "@/types/voice";
import { styles } from "@/src/styles/components/VoiceSelectGrid/styles.module";

import AntDesign from "@expo/vector-icons/AntDesign";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default function VoiceSelectGrid({
  voices,
  selectedVoiceId,
  onSelectVoice,
}: {
  voices: Voice[];
  selectedVoiceId: string | null;
  onSelectVoice: (voiceId: string) => void;
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.voiceContainer}>
        <View style={[styles.voiceImage, styles.createVoiceButton]}>
          <AntDesign name="plus" size={48} color={Colors.white} />
        </View>
        <Text style={styles.voiceName}>Create Voice</Text>
      </View>
      {voices.map((voice) => {
        const isSelected = selectedVoiceId === voice.id;
        return (
        <TouchableOpacity
          key={voice.id}
          style={styles.voiceContainer}
          onPress={() => onSelectVoice(voice.id)}
        >
          {voice.image ? (
            <ImageBackground
              source={voice.image}
              style={[styles.voiceImage, isSelected && styles.selectedVoiceImage]}
              imageStyle={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.voiceImage,
                isSelected && styles.selectedVoiceImage,
                { backgroundColor: voice.placeholderColor ?? "transparent" },
              ]}
            />
          )}
          <Text
            style={[
              styles.voiceName,
              isSelected && styles.selectedVoiceName,
            ]}
          >
            {voice.name}
          </Text>
        </TouchableOpacity>
      )})}
    </ScrollView>
  );
}