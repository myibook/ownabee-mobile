import ModalHeader from '@/components/ModalHeader';
import CreateVoiceForm from '@/components/CreateVoiceForm';
import { styles } from '@/src/styles/create-voice-modal/styles.module';

import { useState } from 'react';
import { Modal, View } from 'react-native';

interface CreateVoiceModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVoiceCreated: () => void;
}

export default function CreateVoiceModal({
  isVisible,
  onClose,
  onVoiceCreated,
}: CreateVoiceModalProps) {
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  return (
    <Modal animationType="fade" transparent visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ModalHeader
            title="Create new voice"
            subtitle="Generate a unique voice for your ebooks"
            onClose={onClose}
            hideCloseButton={isUploadingVoice}
          />
          <CreateVoiceForm
            isUploadingVoice={isUploadingVoice}
            setIsUploadingVoice={setIsUploadingVoice}
            onVoiceCreated={onVoiceCreated}
          />
        </View>
      </View>
    </Modal>
  );
}
