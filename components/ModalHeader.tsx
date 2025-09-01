import { styles } from '@/src/styles/components/modal-header/styles.module';
import { AntDesign } from '@expo/vector-icons';

import { Pressable, Text, View } from 'react-native';

interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onBack?: () => void;
  hideCloseButton?: boolean;
}

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  onBack,
  hideCloseButton,
}: ModalHeaderProps) {
  return (
    <>
      {/* optional back button */}
      {onBack && (
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text>{'< Back'}</Text>
        </Pressable>
      )}

      {/* title and optional subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
      </View>

      {/* close button */}
      {!hideCloseButton && (
        <Pressable onPress={onClose} style={styles.closeButton}>
          <AntDesign name="close" size={20} color="black" />
        </Pressable>
      )}
    </>
  );
}
