import RoundedButton from '@/components/RoundedButton';
import { Colors } from '@/constants/Colors';
import { fetchAudioBookDetail } from '@/services/service';
import { styles } from '@/src/styles/story-detail/styles.module';
import { AudioBookDetail } from '@/types/audiobook';
import { getCachedImageSource } from '@/utils/image';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';

import VoiceSelectorModal from './select-voice-modal';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<AudioBookDetail | null>(null);

  const [isSelectVoiceModalVisible, setIsSelectVoiceModalVisible] = useState<boolean>(false);

  const onSelectVoiceModalClose = () => setIsSelectVoiceModalVisible(false);
  const onSelectVoiceModalOpen = () => setIsSelectVoiceModalVisible(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const detail = await fetchAudioBookDetail(id);
        setBook(detail);
      } catch (err) {
        console.error('📕 Fetch error:', err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href={'/(tabs)/my-shelf'}>
          <Text style={styles.back}>{'< Back'}</Text>
        </Link>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Left: Book cover */}
        <View style={styles.coverWrapper}>
          <Image
            source={book?.coverPageUrl ? getCachedImageSource(book.coverPageUrl) : null}
            style={styles.cover}
            transition={250}
          />
          <Text style={styles.pageCount}>Page 1/{book?.pageCount}</Text>
        </View>

        {/* Right: Story info */}
        <View style={styles.infoPanel}>
          <View>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.text}>{book?.title}</Text>

            <Text style={styles.label}>Created by</Text>
            <Text style={styles.text}>{book?.createdBy}</Text>

            <Text style={styles.label}>Reading level</Text>
            <Text style={styles.text}>{book?.readingLevel}</Text>

            <Text style={styles.label}>Summary</Text>
            <Text style={styles.text}>{book?.summary}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <RoundedButton
              text="Start reading"
              onPress={onSelectVoiceModalOpen}
              color={Colors.baseBlue}
              fontColor={Colors.white}
              fullWidth
            />
            <RoundedButton
              text="Add to list"
              href="/(tabs)/my-shelf"
              color={Colors.baseGray}
              fontColor={Colors.primaryGray}
              fullWidth
            />
          </View>
        </View>
      </View>
      {isSelectVoiceModalVisible && book?.editionId && (
        <VoiceSelectorModal
          editionId={book.editionId}
          isVisible={isSelectVoiceModalVisible}
          onClose={onSelectVoiceModalClose}
        />
      )}
    </View>
  );
}
