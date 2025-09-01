import TopBar from '@/components/TopBar';
import VoiceSelectGrid from '@/components/VoiceSelectGrid';
import { Colors } from '@/constants/Colors';
import { useReader } from '@/context/ReaderProvider';
import { useStory } from '@/context/story';
import { fetchEditionWithTranscript, generateTranscript } from '@/services/service';
import { fetchVoices } from '@/services/voice.service';
import { styles } from '@/src/styles/select-voice/styles.module';
import { Voice } from '@/types/voice';
import CreateVoiceModal from './create-voice-modal';

import { router } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function VoiceSelectorScreen() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isCreateVoiceModalVisible, setIsCreateVoiceModalVisible] = useState(false);

  const { audioBookEditionId } = useStory();
  const { setReaderData } = useReader();

  const onCreateVoiceModalOpen = () => setIsCreateVoiceModalVisible(true);
  const onCreateVoiceModalClose = () => setIsCreateVoiceModalVisible(false);

  const onVoiceCreated = () => {
    loadVoices();
    onCreateVoiceModalClose();
  };

  const handleExport = async () => {
    if (!selectedVoiceId) return;
    setIsStarting(true);
    try {
      const selectedVoice = voices.find(voice => voice.id === selectedVoiceId);
      if (!selectedVoice?.isReady) {
        await generateTranscript(audioBookEditionId, selectedVoiceId);
      }

      const bookData = await fetchEditionWithTranscript(audioBookEditionId, selectedVoiceId);
      setReaderData({...bookData, prevPath: 'writer'});
      router.push('/story-reader');
    } catch (error) {
      console.error('Error exporting story:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const loadVoices = useCallback(
    debounce(async () => {
      setIsLoading(true);
      try {
        const result = await fetchVoices();
        setVoices(result);
      } catch (error) {
        console.error('Error fetching voices:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    loadVoices();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar
        backHref="/cover-editor"
        title="✏️"
        rightButtons={[
          {
            text: 'Export',
            onPress: handleExport,
            color: Colors.baseBlue,
            isLoading: isStarting,
            fontColor: Colors.white,
          },
        ]}
      />
      {isLoading || isStarting ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isLoading ? 'Loading voices...' : 'Exporting your story...'}
          </Text>
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      ) : (
        <VoiceSelectGrid
          variant="page"
          voices={voices}
          selectedVoiceId={selectedVoiceId}
          onSelectVoice={setSelectedVoiceId}
          onPressCreate={() => onCreateVoiceModalOpen()}
        />
      )}
      {isCreateVoiceModalVisible && (
        <CreateVoiceModal
          isVisible={isCreateVoiceModalVisible}
          onClose={onCreateVoiceModalClose}
          onVoiceCreated={onVoiceCreated}
        />
      )}
    </View>
  );
}
