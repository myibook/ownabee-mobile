import RoundedButton from './RoundedButton';
import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/components/create-voice-form/styles.module';
import { uploadVoice } from '@/services/voice.service';

import {
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Audio } from 'expo-av';
import { useState, useEffect, useRef } from 'react';

interface CreateVoiceFormProps {
  isUploadingVoice: boolean;
  setIsUploadingVoice: (isUploadingVoice: boolean) => void;
  onVoiceCreated: () => void;
}

interface FileWithDuration extends DocumentPicker.DocumentPickerAsset {
  duration?: number | null;
}

export default function CreateVoiceForm({
  isUploadingVoice,
  setIsUploadingVoice,
  onVoiceCreated,
}: CreateVoiceFormProps) {
  const [voiceName, setVoiceName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileWithDuration[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const currentAudioRef = useRef<Audio.Sound | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const MAX_TOTAL_SIZE_MB = 50;
  const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

  const handleUpload = async () => {
    if (!voiceName.trim()) {
      Alert.alert('Please enter a name for your voice.');
      return;
    }

    if (selectedFiles.length === 0) {
      Alert.alert('Please select at least one audio or video file.');
      return;
    }

    try {
      setIsUploadingVoice(true);
      await clearAudio();

      const files = selectedFiles.map(
        file =>
          ({
            uri: file.uri,
            type: file.mimeType,
            name: file.name,
          }) as any
      );

      const result = await uploadVoice(voiceName, files);

      if (result.error) {
        Alert.alert('Failed to create voice. Please try again.');
        console.log('Error details:', result.error);
        return;
      }

      onVoiceCreated();
      setVoiceName('');
      setSelectedFiles([]);
      setCurrentAudioIndex(null);
    } catch (error) {
      console.error('Error uploading voice:', error);
      Alert.alert('Failed to create voice. Please try again.');
    } finally {
      setIsUploadingVoice(false);
    }
  };

  // file selection handling
  const handleFileSelect = async () => {
    try {
      setIsUploadingFile(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'video/*'],
        multiple: true,
      });

      if (!result.canceled) {
        const nonDuplicateFiles = filterDuplicateFiles(selectedFiles, result.assets);

        if (nonDuplicateFiles.length < result.assets.length) {
          Alert.alert('Duplicate skipped', 'One or more files were already selected.');
        }

        if (nonDuplicateFiles.length === 0) return;

        if (!validateFileSizes(nonDuplicateFiles, result.assets)) return;

        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const filesWithDuration: FileWithDuration[] = await Promise.all(
          nonDuplicateFiles.map(async file => ({
            ...file,
            duration: await getDurationForFile(file.uri),
          }))
        );

        setSelectedFiles(prev => [...prev, ...filesWithDuration]);
      }
    } catch (error) {
      console.log('Error selecting files:', error);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleGallerySelect = async () => {
    try {
      setIsUploadingFile(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photos Access Denied',
          'Ownabee does not have access to your photos. Please grant permission in your device settings.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const nonDuplicateFiles = filterDuplicateGalleryFiles(selectedFiles, result.assets);

        if (nonDuplicateFiles.length < result.assets.length) {
          Alert.alert('Duplicate skipped', 'One or more files were already selected.');
        }

        if (nonDuplicateFiles.length === 0) return;

        if (!validateFileSizes(nonDuplicateFiles, result.assets)) return;

        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        const filesWithDuration: FileWithDuration[] = await Promise.all(
          nonDuplicateFiles.map(async file => ({
            uri: file.uri,
            mimeType: file.mimeType,
            name: file.fileName || `media_${Date.now()}`,
            size: file.fileSize,
            file: file.file,
            duration: file.duration ? Math.floor(file.duration / 1000) : null,
          }))
        );

        setSelectedFiles(prev => [...prev, ...filesWithDuration]);
      }
    } catch (error) {
      console.log('Error selecting from gallery:', error);
      Alert.alert('Failed to select media from gallery, please try again.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const filterDuplicateFiles = (
    currentFiles: FileWithDuration[],
    newFiles: DocumentPicker.DocumentPickerAsset[]
  ) => {
    return newFiles.filter(
      newFile =>
        !currentFiles.some(
          file =>
            newFile.name === file.name &&
            newFile.size === file.size &&
            newFile.mimeType === file.mimeType
        )
    );
  };

  const filterDuplicateGalleryFiles = (
    currentFiles: FileWithDuration[],
    newFiles: ImagePicker.ImagePickerAsset[]
  ) => {
    return newFiles.filter(
      newFile =>
        !currentFiles.some(
          file =>
            newFile.fileName === file.name &&
            newFile.fileSize === file.size &&
            newFile.mimeType === file.mimeType
        )
    );
  };

  const validateFileSizes = (currentFiles: any[], newFiles: any[]) => {
    const currentSize = getTotalFileSize(currentFiles);
    const newFilesSize = newFiles.reduce((total, file) => total + (file.size || file.fileSize), 0);

    if (currentSize + newFilesSize > MAX_TOTAL_SIZE_BYTES) {
      Alert.alert(
        'File Size Limit Exceeded',
        'Please select smaller files or remove some existing files.'
      );
      return false;
    }
    return true;
  };

  const getTotalFileSize = (files: FileWithDuration[]) => {
    return files.reduce((total, file) => total + (file.size || 0), 0);
  };

  const getDurationForFile = async (fileUri: string): Promise<number | null> => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: fileUri }, { shouldPlay: false });

      const status = await sound.getStatusAsync();
      await sound.unloadAsync();

      if (status.isLoaded && status.durationMillis) {
        return Math.round(status.durationMillis / 1000);
      }
      return null;
    } catch (error) {
      console.error('Error getting duration:', error);
      return null;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const removeFile = async (index: number) => {
    if (currentAudioIndex === index) {
      await clearAudio();
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileTypeText = (mimeType: string | undefined) => {
    if (mimeType?.startsWith('video/')) {
      return 'Video';
    }
    return 'Audio';
  };

  const showSelectionOptions = () => {
    const options = ['Photo Gallery', 'Files', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        useModal: true,
        title: 'Select Media Source',
        message: 'Choose where to select your audio/video files from',
      },
      selectedIndex => {
        switch (selectedIndex) {
          case 0:
            handleGallerySelect();
            break;
          case 1:
            handleFileSelect();
            break;
          case cancelButtonIndex:
            break;
        }
      }
    );
  };

  // audio playback handling
  const playAudio = async (fileUri: string, index: number) => {
    try {
      if (currentAudioIndex === index && currentAudioRef.current) {
        const status = await currentAudioRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await currentAudioRef.current.stopAsync();
            setIsPlaying(false);
          } else {
            await currentAudioRef.current.playAsync();
            setIsPlaying(true);
          }
        }
        return;
      }

      if (currentAudioRef.current) {
        await currentAudioRef.current.stopAsync();
        await currentAudioRef.current.unloadAsync();
        currentAudioRef.current = null;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );
      currentAudioRef.current = newSound;
      setCurrentAudioIndex(index);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setCurrentAudioIndex(null);
          setIsPlaying(false);
          currentAudioRef.current = null;
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurrentAudioIndex(null);
      setIsPlaying(false);
    }
  };

  const clearAudio = async () => {
    try {
      if (currentAudioRef.current) {
        await currentAudioRef.current.stopAsync();
        await currentAudioRef.current.unloadAsync();
        currentAudioRef.current = null;
        setCurrentAudioIndex(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const renderFiles = () => {
    return selectedFiles.map((file, index) => {
      const fileType = getFileTypeText(file.mimeType);
      const playing = currentAudioIndex === index && isPlaying;
      return (
        <View key={index} style={styles.fileContainer}>
          <View style={styles.fileInfoContainer}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.fileMetadata} numberOfLines={1}>
              {file.duration ? `${formatDuration(file.duration)} • ${fileType}` : fileType}
            </Text>
          </View>
          <View style={styles.iconButtonContainer}>
            <TouchableOpacity
              onPress={() => playAudio(file.uri, index)}
              style={styles.iconButton}
              disabled={isUploadingFile}
            >
              <Ionicons name={playing ? 'stop' : 'play'} size={20} color={Colors.black} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeFile(index)}
              style={styles.iconButton}
              disabled={isUploadingFile}
            >
              <Feather name="trash-2" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      setVoiceName('');
      setSelectedFiles([]);
      clearAudio();
    };
  }, []);

  return (
    <View style={styles.container}>
      {isUploadingVoice ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Creating your voice...</Text>
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      ) : (
        <>
          <TextInput
            placeholder="Name your voice"
            placeholderTextColor={Colors.quaternaryGray}
            style={styles.input}
            onChangeText={setVoiceName}
            value={voiceName}
          />
          {selectedFiles.length > 0 ? (
            <>
              <ScrollView
                contentContainerStyle={styles.selectedFilesContainer}
                showsVerticalScrollIndicator={false}
              >
                {renderFiles()}
              </ScrollView>
              <View style={styles.buttonContainer}>
                <RoundedButton
                  text="Upload more"
                  onPress={() => showSelectionOptions()}
                  color={Colors.baseGray}
                  fontColor={Colors.black}
                  disabled={isUploadingFile}
                />
                <RoundedButton
                  text="Start"
                  onPress={() => handleUpload()}
                  color={Colors.baseBlue}
                  fontColor={Colors.white}
                  disabled={isUploadingFile}
                />
              </View>
            </>
          ) : (
            <>
              {isUploadingFile ? (
                <View style={styles.uploadContainer}>
                  <ActivityIndicator color={Colors.primaryGray} />
                </View>
              ) : (
                <Pressable style={styles.uploadContainer} onPress={showSelectionOptions}>
                  <RoundedButton
                    text="Upload audio"
                    onPress={showSelectionOptions}
                    color={Colors.baseBlue}
                    fontColor={Colors.white}
                  />
                  <Text style={styles.uploadText}>from video or audio files</Text>
                </Pressable>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}
