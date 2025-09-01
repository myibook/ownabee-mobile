import DraggableText from '@/components/DraggableText';
import ImageGenerationModal from '@/components/ImageGenerationModal';
import TopBar from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useStory } from '@/context/story';
import { createCover, fetchEditionImages } from '@/services/service';
import { styles } from '@/src/styles/cover-editor/styles.module';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { captureRef } from 'react-native-view-shot';

import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel1,
  Swatches,
} from 'reanimated-color-picker';

export default function CoverEditorScreen() {
  const { audioBookEditionId, audioBook, coverPage, setCoverPage } = useStory();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const [signal, setSignal] = useState(0);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [pickerColor, setPickerColor] = useState('');

  // Add state for ImageGenerationModal
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const viewRef = useRef<any>(null);
  const draggableTextRef = useRef<any>(null);

  const [savedData, setSavedData] = useState<any>(null);
  const [coverImageUri, setCoverImageUri] = useState<string>();
  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

  useEffect(() => {
    loadJSON();
  }, [coverPage]);

  const openBackgroundColorPicker = () => {
    setShowBackgroundColorPicker(true);
    setPickerColor(backgroundColor);
  };

  const loadJSON = () => {
    if (coverPage) {
      setBackgroundColor(coverPage.backgroundColor);
      setCoverImageUri(coverPage.coverImageUri);
    }
    fetchEditionImages(audioBookEditionId).then(imgs => {
      const uris = imgs.map(i => i.url);
      setGeneratedImages(prev => {
        const merged = [...uris, ...prev.filter(u => !uris.includes(u))];
        return merged;
      });
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!draggableTextRef.current) {
        console.log('DraggableText ref not available');
        setIsSubmitting(false);
        return;
      }
      const textItems = draggableTextRef.current.getTextItems();
      const jsonData = {
        textItems,
        backgroundColor,
        coverImageUri,
        timestamp: new Date().toISOString(),
      };

      setCoverPage(jsonData);
      setSignal(s => s + 1);
      await new Promise(resolve => setTimeout(resolve, 100));
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      await createCover(audioBookEditionId, jsonData, uri);

      router.push({ pathname: '/cover-complete' });
    } catch (e) {
      Alert.alert('Error', 'Failed to save cover. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for when an image is selected from the modal
  const handleImagePicked = (uri: string) => {
    setCoverImageUri(uri);
    // Add to generated images list if it's not already there
    if (!generatedImages.includes(uri)) {
      setGeneratedImages(prev => [uri, ...prev]);
    }
    setImageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TopBar
        backHref="/image-format"
        title={audioBook!.title}
        rightButtons={[
          {
            text: "I'm done!",
            onPress: () => handleSubmit(),
            color: Colors.baseBlue,
            isLoading: isSubmitting,
            fontColor: Colors.white,
          },
        ]}
      />

      <View style={styles.mainContainer}>
        {/* 중앙 콘텐츠 미리보기 */}
        <View
          ref={viewRef}
          style={[styles.main, backgroundColor ? { backgroundColor } : null]}
          collapsable={false}
          onLayout={event => {
            const { width, height } = event.nativeEvent.layout;
            setImageLayout({ width, height });
          }}
        >
          <Image
            source={{ uri: coverImageUri }}
            style={styles.selectediImage}
            resizeMode="contain"
          />
          <Pressable onPress={() => setSignal(s => s + 1)} style={styles.clickSignalContainer} />
          <DraggableText
            ref={draggableTextRef}
            triggerSignal={signal}
            boundingBox={imageLayout}
            initialData={coverPage}
            title={audioBook!.title}
            openBackgroundColorPicker={openBackgroundColorPicker}
          />
        </View>

        <View style={styles.rightSidePanel}>
          <TouchableOpacity style={styles.sideButton} onPress={openBackgroundColorPicker}>
            <Text style={styles.sideButtonText}>Background Color</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sideButton}
            onPress={() => draggableTextRef.current?.addTextInput()}
          >
            <Text style={styles.sideButtonText}>Add New Text</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.imgListContentContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.imgList}
        >
          {/* AI Generate button in the image list */}
          <TouchableOpacity
            onPress={() => setImageModalVisible(true)}
            style={[
              styles.imageChoice,
              {
                borderWidth: 2,
                borderColor: Colors.mediumPurple,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <MaterialIcons name="auto-awesome" size={30} color={Colors.mediumPurple} />
            <Text style={{ fontSize: 10, color: Colors.mediumPurple, marginTop: 4 }}>
              AI Generate
            </Text>
          </TouchableOpacity>

          {generatedImages.map((uri, index) => (
            <TouchableOpacity key={`generated-${index}`} onPress={() => setCoverImageUri(uri)}>
              <Image source={{ uri }} style={styles.imageChoice} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Background Color Picker Modal */}
      <Modal visible={showBackgroundColorPicker} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={backgroundColor}
              sliderThickness={25}
              thumbSize={24}
              thumbShape="circle"
              onCompleteJS={(color: any) => {
                setPickerColor(color.hex);
              }}
              style={styles.picker}
              boundedThumb
            >
              <Panel1 style={styles.panelStyle} />
              <HueSlider style={styles.sliderStyle} />
              <OpacitySlider style={styles.sliderStyle} />
              <Swatches
                style={styles.swatchesContainer}
                swatchStyle={styles.swatchStyle}
                colors={customSwatches}
              />
              <View style={styles.colorPickerButtonContainer}>
                <TouchableOpacity
                  style={styles.colorPickerCloseButton}
                  onPress={() => {
                    setShowBackgroundColorPicker(false);
                    setPickerColor('');
                  }}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.colorPickerCloseButton}
                  onPress={() => {
                    setShowBackgroundColorPicker(false);
                    setBackgroundColor(pickerColor);
                    setPickerColor('');
                  }}
                >
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </ColorPicker>
          </View>
        </View>
      </Modal>

      <ImageGenerationModal
        visible={isImageModalVisible}
        onClose={() => setImageModalVisible(false)}
        initialTries={3}
        imageItemId="1"
        defaultPrompt={`Create a book cover for "${audioBook!.title}"`}
        initialPrompt={`Create a book cover for "${audioBook!.title}"`}
        audioBookEditionId={audioBookEditionId}
        initialRatio="9:16"
        onPick={handleImagePicked}
      />
    </View>
  );
}
