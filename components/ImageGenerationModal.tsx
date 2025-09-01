import { Colors } from '@/constants/Colors';
import { usePages } from '@/context/PageProvider';
import { useStory } from '@/context/story';
import {
  fetchEditionImages,
  generateCharactersForEdition,
  generateImageWithCharacters,
} from '@/services/service';
import { styles } from '@/src/styles/components/image-generate-modal/styles.module';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialPrompt?: string;
  defaultPrompt: string;
  initialTries?: number;
  onPick?: (uri: string) => void;
  audioBookEditionId?: string;
  imageItemId?: string; // key to persist tries per image item
  initialRatio?: string;
};

export default function ImageGenerationModal({
  visible,
  onClose,
  initialPrompt = '',
  initialTries = 3,
  onPick,
  defaultPrompt = '',
  audioBookEditionId,
  imageItemId,
  initialRatio = '1:1',
}: Props) {
  const story = useStory();
  const { getOrInitImageTries, decrementImageTries, isGeneratingImage, setGeneratingImage } =
    usePages();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [triesLeft, setTriesLeft] = useState(initialTries);
  const [loading, setLoading] = useState(false);
  const [previewUris, setPreviewUris] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewWidth, setPreviewWidth] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState(initialRatio);

  const ratioOptions = [{ key: '1:1' }, { key: '16:9' }, { key: '9:16' }];

  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const disabledGenerate = loading || triesLeft <= 0 || !imageItemId;

  // initialize every time the modal is opened
  useEffect(() => {
    if (visible) {
      setPrompt(initialPrompt);
      setSelectedRatio(initialRatio);
      // Persist tries across open/close using context, keyed by edition + imageItemId
      if (imageItemId) {
        const current = getOrInitImageTries(audioBookEditionId, imageItemId, initialTries);
        setTriesLeft(current);
        const inflight = isGeneratingImage(audioBookEditionId, imageItemId);
        setLoading(inflight);
      } else {
        setTriesLeft(initialTries);
        setLoading(false);
      }
      setPreviewUris([]);
      setCurrentIndex(0);
      setPreviewWidth(0);
      setError(null);
      if (audioBookEditionId) {
        // 미리 저장된 이미지 목록 로드 (최신순)
        fetchEditionImages(audioBookEditionId)
          .then(imgs => {
            console.log('imgs: ', imgs);
            const uris = imgs.map(i => i.url);
            setPreviewUris(prev => {
              const merged = [...uris, ...prev.filter(u => !uris.includes(u))];
              return merged;
            });
          })
          .catch(() => {
            setPreviewUris([]);
          });
      } else {
        setPreviewUris([]);
      }

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 6 }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.95);
    }
  }, [
    visible,
    initialPrompt,
    initialTries,
    initialRatio,
    audioBookEditionId,
    imageItemId,
    opacity,
    scale,
  ]);

  const handleGenerate = async () => {
    if (disabledGenerate) return;
    setLoading(true);
    if (imageItemId) setGeneratingImage(audioBookEditionId, imageItemId, true);
    setError(null);
    try {
      // 1) 캐릭터 생성(에디션 기준) -> 2) 캐릭터들과 프롬프트로 이미지 생성 -> 3) 결과 url 미리보기/저장
      let characterUids: string[] = story?.characterUids ?? [];
      const effectiveEditionId = audioBookEditionId || story?.audioBookEditionId;
      if (characterUids.length === 0 && effectiveEditionId) {
        try {
          const { characterUids: ids } = await generateCharactersForEdition({
            audioBookEditionId: effectiveEditionId,
          });
          characterUids = ids || []; // Use empty array if no characters returned
          story?.setCharacterUids?.(ids || []);
        } catch (error) {
          console.log('No characters generated, continuing with scene-only generation');
          characterUids = []; // Continue with empty array
        }
      }

      const { sceneImageUrl } = await generateImageWithCharacters(
        characterUids,
        prompt.trim() || defaultPrompt,
        {
          audioBookEditionId,
          ratio: selectedRatio,
        }
      );

      if (sceneImageUrl) {
        setPreviewUris(prev => [sceneImageUrl, ...prev.filter(u => u !== sceneImageUrl)]);
        setCurrentIndex(0);
      } else {
        setError('No image returned. Please try again.');
      }
      if (imageItemId) {
        const next = decrementImageTries(audioBookEditionId, imageItemId);
        setTriesLeft(next);
      } else {
        setTriesLeft(t => Math.max(0, t - 1));
      }
    } catch {
      // console.log(e);
      setError('Image generation failed. Please try again.');
      if (imageItemId) {
        const next = decrementImageTries(audioBookEditionId, imageItemId);
        setTriesLeft(next);
      } else {
        setTriesLeft(t => Math.max(0, t - 1));
      }
    } finally {
      setLoading(false);
      if (imageItemId) setGeneratingImage(audioBookEditionId, imageItemId, false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          {/* Preview area */}
          <LinearGradient
            colors={['rgba(236,236,236,1)', 'rgba(176,174,174,1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewBox}
            onLayout={e => setPreviewWidth(e.nativeEvent.layout.width)}
          >
            {loading ? (
              <View style={styles.loadingCover}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Generating…</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={evt => {
                  const x = evt.nativeEvent.contentOffset.x;
                  if (previewWidth > 0) {
                    const idx = Math.round(x / previewWidth);
                    if (idx !== currentIndex) setCurrentIndex(idx);
                  }
                }}
              >
                {previewUris.length > 0 ? (
                  previewUris.map((uri, i) => (
                    <View
                      key={i}
                      style={[styles.slide, styles.slideWithBackground, { width: previewWidth }]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                          onPick && onPick(uri);
                          onClose();
                        }}
                        style={styles.imageContainer}
                      >
                        <Image source={{ uri }} style={styles.previewImage} resizeMode="contain" />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={[styles.slide, { width: previewWidth }]}>
                    <View style={styles.previewPlaceholder}>
                      <AntDesign name="picture" size={42} color={Colors.silverMedium} />
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
            {/* page indicator */}
            {previewUris.length > 1 && (
              <View style={styles.dotContainer}>
                {previewUris.map((_, i) => (
                  <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                ))}
              </View>
            )}
          </LinearGradient>

          {/* Error */}
          {/* {error && <Text style={styles.errorText}>{error}</Text>} */}

          <View style={styles.divider} />

          {/* Ratio Selection */}
          <View style={styles.ratioSection}>
            <Text style={styles.ratioTitle}>Aspect Ratio</Text>
            <View style={styles.ratioButtons}>
              {ratioOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.ratioButton,
                    selectedRatio === option.key && styles.ratioButtonActive,
                  ]}
                  onPress={() => setSelectedRatio(option.key)}
                  disabled={loading}
                >
                  <Text
                    style={[styles.ratioKey, selectedRatio === option.key && styles.ratioKeyActive]}
                  >
                    {option.key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Prompt input */}
          <View style={styles.promptRow}>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter a description for the image to generate"
              placeholderTextColor={Colors.silverMedium}
              style={styles.input}
              editable={!loading}
              multiline
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* <TouchableOpacity
              style={styles.optionFab}
              // onPress={handleOpenSettings}
              // disabled={!handleOpenSettings}
              accessibilityLabel="Open options"
            >
              <Image
                source={require('./../assets/images/settings.png')}
                style={styles.settingsIcon}
              />
            </TouchableOpacity> */}
            <View style={styles.rightArea}>
              <Text style={styles.triesText}>
                {triesLeft}/{initialTries} tries left
              </Text>
              <TouchableOpacity
                style={[styles.generateBtn, disabledGenerate && { opacity: 0.6 }]}
                onPress={handleGenerate}
                disabled={disabledGenerate}
              >
                <Text style={styles.generateText}>{loading ? 'Generating...' : 'Generate'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
