import { Colors } from '@/constants/Colors';
import { Voice } from '@/types/voice';
import { styles } from '@/src/styles/components/voice-select-grid/styles.module';
import { getCachedImageSource } from '@/utils/image';

import { AntDesign, Feather } from '@expo/vector-icons';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ImageBackground } from 'expo-image';

export default function VoiceSelectGrid({
  variant,
  voices,
  selectedVoiceId,
  onSelectVoice,
  onPressCreate,
}: {
  variant?: 'page' | 'modal';
  voices: Voice[];
  selectedVoiceId: string | null;
  onSelectVoice: (voiceId: string) => void;
  onPressCreate: () => void;
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContainer,
        variant === 'modal' && styles.modalScrollContainer,
      ]}
    >
      <View style={styles.voiceContainer}>
        <TouchableOpacity
          style={[styles.voiceImage, styles.createVoiceButton]}
          onPress={onPressCreate}
        >
          <AntDesign name="plus" size={48} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.voiceName}>Create Voice</Text>
      </View>
      {voices.map(voice => {
        const isSelected = selectedVoiceId === voice.id;
        const isNew = !voice.isReady && Date.parse(voice.createdAt) > Date.now() - 5 * 60 * 1000; // 5 minutes
        return (
          <TouchableOpacity
            key={voice.id}
            style={styles.voiceContainer}
            onPress={() => onSelectVoice(voice.id)}
          >
            <View>
              {voice.displayImage ? (
                <ImageBackground
                  source={getCachedImageSource(voice.displayImage)}
                  style={[styles.voiceImage, isSelected && styles.selectedVoiceImage]}
                  imageStyle={styles.image}
                  transition={250}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.voiceImage,
                    isSelected && styles.selectedVoiceImage,
                    { backgroundColor: voice.displayColor ?? 'transparent' },
                  ]}
                />
              )}
              {isSelected && (
                <View style={styles.selectedVoiceIcon}>
                  <Feather name="check" size={48} color={Colors.white} />
                </View>
              )}
              {voice.isReady && (
                <View style={styles.readyVoiceBadge}>
                  <Text style={styles.badgeText}>READY</Text>
                </View>
              )}
              {isNew && (
                <View style={styles.newVoiceBadge}>
                  <Text style={styles.badgeText}>NEW</Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.voiceName, isSelected && styles.selectedVoiceName]}
              numberOfLines={1}
            >
              {voice.displayName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
