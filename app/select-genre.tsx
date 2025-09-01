import RoundedButton from '@/components/RoundedButton';
import { Colors } from '@/constants/Colors';
import { useStory } from '@/context/story';
import { createBook } from '@/services/service';
import { styles } from '@/src/styles/select-genre/styles.module';
import { AudioBook } from '@/types/audiobook';
import { router, useLocalSearchParams } from 'expo-router';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// TODO: Possible keep list in the DB
const GENRES = [
  'Picture',
  'Everyday life',
  'Rhyming',
  'Imaginative',
  'Social-emotional',
  'Interactive',
  'Others',
];

export default function GenreSelectorScreen() {
  const { setAudioBookEditionId, setAudioBook, clearData } = useStory();
  const [selected, setSelected] = useState<string | null>(null);
  const { title } = useLocalSearchParams<{ title: string }>();
  const [isStarting, setIsStarting] = useState(false); // ★ 추가: 시작 버튼 로딩 상태

  useEffect(() => {
    clearData();
  }, []);

  const handleStart = async () => {
    if (!selected || isStarting) {
      return;
    }
    setIsStarting(true);
    try {
      if (!selected) return;
      const createdAudioBook = await createBook(title, selected!);
      setAudioBook(_.omit(createdAudioBook, 'editions') as AudioBook);
      setAudioBookEditionId(createdAudioBook.editions[0].id);
      router.push({ pathname: '/story-editor' });
    } catch (error) {
      console.error('❌ 저장 실패 handleStart', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a genre</Text>

      <ScrollView contentContainerStyle={styles.genreList} showsVerticalScrollIndicator={false}>
        {GENRES.map(genre => {
          const isSelected = selected === genre;
          return (
            <TouchableOpacity
              key={genre}
              onPress={() => setSelected(genre)}
              style={[styles.genreButton, isSelected && styles.genreSelected]}
            >
              <Text style={[styles.genreText, isSelected && styles.genreTextSelected]}>
                {genre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <RoundedButton text="Back" href="/" color={Colors.darkBlue} />
        <RoundedButton
          text="Start writing"
          disabled={!selected}
          isSaving={isStarting}
          onPress={handleStart}
          fontColor={Colors.black}
        />
      </View>
    </View>
  );
}
