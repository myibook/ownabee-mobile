import RoundedButton from '@/components/RoundedButton';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/auth';
import { styles } from '@/src/styles/eLibrary/styles.module';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import StoryTitleModal from '../story-title-modal';

export default function ELibraryScreen() {
  const [isTitleModalVisible, setIsTitleModalVisible] = useState<boolean>(false);
  const { signOut, user } = useAuth();

  const onTitleModalClose = () => {
    setIsTitleModalVisible(false);
  };

  const onTitleModalOpen = () => {
    setIsTitleModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RoundedButton
          text="Sign out"
          onPress={signOut}
          color={Colors.destructive}
          fontColor={Colors.white}
        />
        <RoundedButton
          text="Create story"
          onPress={onTitleModalOpen}
          color={Colors.baseBlue}
          fontColor={Colors.white}
        />
        <View>
          <Image source={{ uri: user?.picture }} style={styles.picture} />
        </View>
        <StoryTitleModal isVisible={isTitleModalVisible} onClose={onTitleModalClose} />
      </View>
      <Text>email : {user?.email}</Text>
    </View>
  );
}
