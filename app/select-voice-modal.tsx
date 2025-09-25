import CreateVoiceForm from '@/components/CreateVoiceForm';
import ModalHeader from '@/components/ModalHeader';
import RoundedButton from '@/components/RoundedButton';
import VoiceSelectGrid from '@/components/VoiceSelectGrid';
import { Colors } from '@/constants/Colors';
import { useReader } from '@/context/ReaderProvider';
import { fetchEditionWithTranscript, generateTranscript } from '@/services/service';
import { fetchVoicesWithReadyStatus } from '@/services/voice.service';
import { styles } from '@/src/styles/select-voice-modal/styles.module';
import { Voice } from '@/types/voice';

import { router } from 'expo-router';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

interface VoiceSelectorModalProps {
  editionId: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function VoiceSelectorModal({
  editionId,
  isVisible,
  onClose,
}: VoiceSelectorModalProps) {
  const [tab, setTab] = useState<'select' | 'create'>('select');

  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);

  const [isUploadingVoice, setIsUploadingVoice] = useState<boolean>(false);

  const [isStarting, setIsStarting] = useState<boolean>(false);
  const { setReaderData } = useReader();

  const onVoiceCreated = () => {
    loadVoices();
    setTab('select');
  };

  const handleStart = async () => {
    if (!selectedVoiceId) return;
    setIsStarting(true);
    try {
      const selectedVoice = voices.find(voice => voice.id === selectedVoiceId);
      if (!selectedVoice?.isReady) {
        await generateTranscript(editionId, selectedVoiceId);
      }

      const bookData = await fetchEditionWithTranscript(editionId, selectedVoiceId);
      setReaderData({...bookData, prevPath: 'library'});
      router.push('/story-reader');
      onClose();
    } catch (error) {
      console.error('Error starting reader:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const loadVoices = useCallback(
    debounce(async () => {
      setIsLoading(true);
      try {
        const result = await fetchVoicesWithReadyStatus(editionId);
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
    <Modal statusBarTranslucent animationType="fade" transparent visible={isVisible}>
      <ActionSheetProvider>
        <View style={styles.overlay}>
          {tab === 'select' && (
            <View style={[styles.modalContainer, styles.noBottomPadding]}>
              <ModalHeader title="Select a voice" onClose={onClose} />
              {isLoading || isStarting ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>
                    {isLoading ? 'Loading voices...' : 'Loading story...'}
                  </Text>
                  <ActivityIndicator size="large" color={Colors.black} />
                </View>
              ) : (
                <VoiceSelectGrid
                  variant="modal"
                  voices={voices}
                  selectedVoiceId={selectedVoiceId}
                  onSelectVoice={setSelectedVoiceId}
                  onPressCreate={() => setTab('create')}
                />
              )}
              <View style={styles.startButtonContainer}>
                <RoundedButton
                  text="Start"
                  onPress={handleStart}
                  color={Colors.baseBlue}
                  fontColor={Colors.white}
                  disabled={!selectedVoiceId}
                />
              </View>
            </View>
          )}
          {tab === 'create' && (
            <View style={styles.modalContainer}>
              <ModalHeader
                title="Create new voice"
                subtitle="Generate a unique voice for your ebooks"
                onClose={onClose}
                onBack={() => setTab('select')}
              />
              <CreateVoiceForm
                isUploadingVoice={isUploadingVoice}
                setIsUploadingVoice={setIsUploadingVoice}
                onVoiceCreated={onVoiceCreated}
              />
            </View>
          )}
        </View>
      </ActionSheetProvider>
    </Modal>
  );
}
