import PageThumbnail from '@/components/PageThumbnail';
import RoundedButton from '@/components/RoundedButton';
import TopBar from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/auth';
import { useStory } from '@/context/story';
import { deleteText, generateCharactersForEdition, saveTextsToServer } from '@/services/service';
import { styles } from '@/src/styles/story-editor/styles.module';
import { TextData } from '@/types/audiobook';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function StoryEditorScreen() {
  const {
    texts,
    setTexts,
    audioBookEditionId,
    audioBook,
    resetGrammarStatusOnEdit,
    grammarStatus,
    setCharacterUids,
  } = useStory();

  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false);
  const [activeAction, setActiveAction] = useState<null | 'save' | 'done'>(null);
  const [aiVisible, setAiVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lastSavedData, setLastSavedData] = useState<TextData[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveDataAbortController = useRef<AbortController | null>(null);

  useEffect(() => {
    const setFirstText = async () => {
      try {
        if (texts.length === 0) {
          const data = await saveTextsToServer([{ audioBookEditionId, order: 0 }]);
          setTexts(data);
        }
      } catch (error) {
        console.error('첫 페이지 저장 실패:', error);
      }
    };
    setFirstText();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => saveData(texts), 3000);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [texts]);

  const handleTextChange = (newText: string) => {
    const newTexts = [...texts];
    newTexts[selectedIndex] = { ...newTexts[selectedIndex], originalText: newText };
    setTexts(newTexts);
    const selectedTextId = texts[selectedIndex].id!;
    if (grammarStatus[selectedTextId]?.checked) {
      resetGrammarStatusOnEdit(selectedTextId);
    }
  };

  const saveData = async (currentData: TextData[]) => {
    try {
      if (_.isEqual(currentData, lastSavedData)) return;
      if (saveDataAbortController.current) {
        saveDataAbortController.current.abort();
      }
      saveDataAbortController.current = new AbortController();
      const signal = saveDataAbortController.current.signal;

      await saveTextsToServer(currentData, signal);
      setLastSavedData(_.cloneDeep(currentData));
    } catch (_e) {
      console.error(`story-editor : saveData 저장 실패 userId = ${user?.id} error = ${_e}`);
    }
  };

  const addText = async () => {
    try {
      const [newText] = await saveTextsToServer([{ order: texts.length, audioBookEditionId }]);
      const updatedTexts = [...texts, newText];
      setTexts(updatedTexts);
      setSelectedIndex(texts.length);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('❌ addText error:', error);
    }
  };

  const saveBook = async (currentData: TextData[]) => {
    try {
      setIsSaving(true);
      await saveData(currentData);
      if (audioBookEditionId) {
        generateCharactersForEdition({ audioBookEditionId })
          .then(({ characterUids }) => setCharacterUids(characterUids))
          .catch(_unused => {});
      }
    } catch (e) {
      console.error(`story-editor : saveData 저장 실패 userId = ${user?.id} error = ${e}`);
    } finally {
      setIsSaving(false);
    }
  };

  const saveAndSubmit = async () => {
    try {
      setIsSubmitting(true);
      await saveData(texts);
      if (audioBookEditionId) {
        generateCharactersForEdition({ audioBookEditionId })
          .then(({ characterUids }) => setCharacterUids(characterUids))
          .catch(_unused => {});
      }
      router.push({ pathname: '/writing-complete' });
    } catch (e) {
      console.error(`story-editor : saveData 저장 실패 userId = ${user?.id} error = ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteText = async (indexToDelete: number) => {
    if (texts.length === 1) {
      Alert.alert('Every story needs at least one page.');
      return;
    }
    const deletedText = texts[indexToDelete];
    if (deletedText?.id) {
      try {
        await deleteText(deletedText.id);
        const newTexts = texts
          .filter((_, i) => i !== indexToDelete)
          .map((text, idx) => ({ ...text, order: idx }));
        setTexts(newTexts);

        if (selectedIndex >= newTexts.length) {
          setSelectedIndex(newTexts.length - 1);
        } else if (indexToDelete <= selectedIndex) {
          setSelectedIndex(Math.max(0, selectedIndex - 1));
        }
      } catch (error) {
        Alert.alert('삭제 실패', '잠시 후 다시 시도해 주세요.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        onBackPress={() => router.dismissAll()}
        title={audioBook!.title}
        rightButtons={[
          {
            text: "I'm done writing",
            color: Colors.baseYellow,
            fontColor: Colors.black,
            isLoading: isSubmitting,
            onPress: () => saveAndSubmit(),
          },
          {
            text: 'Save',
            color: Colors.lightBlue,
            isLoading: isSaving,
            onPress: () => saveBook(texts),
          },
        ]}
      />

      <View style={styles.sidebar}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.previewContainer}>
          {texts.map((text, index) => (
            <View key={index} style={styles.preview}>
              <PageThumbnail
                content={text}
                isSelected={selectedIndex === index}
                onPress={() => setSelectedIndex(index)}
              />
              <Pressable onPress={() => handleDeleteText(index)} style={styles.previewDelete}>
                <Text style={styles.previewDeleteText}>✕</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View style={styles.newPageButton}>
          <RoundedButton text="New Page" onPress={addText} color={Colors.baseBlue} />
        </View>
      </View>

      <View style={styles.editorContainer}>
        <View style={styles.textInputHeader}>
          <Text style={styles.lastEdit}>Last edited | {new Date().toLocaleString()}</Text>
          <Text style={styles.pageInfo}>
            Page {selectedIndex + 1} of {texts.length}
          </Text>
        </View>
        <View style={styles.textInputContainer} />
        <TextInput
          ref={textInputRef}
          value={texts[selectedIndex]?.originalText}
          onChangeText={handleTextChange}
          style={styles.textInput}
          placeholder="Once upon a time, there lived a bunny named Harry..."
          placeholderTextColor={Colors.quaternaryGray}
          multiline
        />
      </View>
      {aiVisible ? (
        <Pressable
          style={styles.aiPanel}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>AI Companion</Text>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setAiVisible(false);
              }}
            >
              <MaterialCommunityIcons
                name="close-box-outline"
                size={24}
                color={Colors.silverMedium}
              />
            </Pressable>
          </View>
          <Text style={styles.aiText}>
            ✨ What Makes a Rhyming Book?{'\n'}A rhyming book is a story that sounds like a song
            when you read it out loud...
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.infoIcon}
          onPress={() => {
            Keyboard.dismiss();
            setAiVisible(true);
          }}
        >
          <Ionicons name="information-circle-outline" size={24} color={Colors.silverMedium} />
        </Pressable>
      )}
    </View>
  );
}
