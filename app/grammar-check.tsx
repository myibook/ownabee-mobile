import GrammarPanel from '@/components/GrammarPanel';
import PageThumbnail from '@/components/PageThumbnail';
import TopBar from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useStory } from '@/context/story';
import { saveTextsToServer, updateGrammarCorrectedText } from '@/services/service';
import { styles } from '@/src/styles/grammar-check/styles.module';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';

import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function GrammarCheckScreen() {
  const {
    texts,
    setTexts,
    grammarStatus,
    audioBook,
    resetGrammarStatusOnEdit,
    checkTextGrammar,
    isChecking,
    grammarResult,
    setGrammarResult,
  } = useStory();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingTexts, setEditingTexts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkTextGrammar(texts[selectedIndex]?.originalText!, texts[selectedIndex].id!);
  }, []);

  const handleTextChange = (newText: string) => {
    const newTexts = [...texts];
    newTexts[selectedIndex] = {
      ...newTexts[selectedIndex],
      originalText: newText,
    };
    setTexts(newTexts);
  };

  const handleSelectContent = async (index: number, textId: string) => {
    setSelectedIndex(index);
    await checkTextGrammar(texts[index].originalText!, textId);
  };

  const removeEditingTextAtIndex = (index: number) => {
    setEditingTexts(prev => {
      const newEditingTexts = [...prev];
      newEditingTexts[index] = '';
      return newEditingTexts;
    });
  };

  const handleEditDone = (index: number) => {
    const { id, originalText } = texts[index];
    const editingText = editingTexts[index] || '';
    if (originalText!.trim() !== editingText) {
      Alert.alert('문법 체크 초기화', '텍스트가 변경되어 문법 체크 데이터가 초기화됩니다.', [
        { text: '확인', onPress: async () => resetGrammarStatusOnEdit(id!) },
        {
          text: '취소',
          style: 'cancel',
          onPress: () => handleEditCancel(index),
        },
      ]);
    }
    removeEditingTextAtIndex(index);
  };

  const handleEditCancel = (index: number) => {
    const originalText = editingTexts[index];
    handleTextChange(originalText);
    removeEditingTextAtIndex(index);
  };

  const handleEditStart = (index: number) => {
    setEditingTexts(prev => {
      const newEditingTexts = [...prev];
      newEditingTexts[index] = texts[index]?.originalText || '';
      return newEditingTexts;
    });
  };

  const applyFixesByContext = (fix: any) => {
    const textId = texts[selectedIndex].id!;
    let updatedText = texts[selectedIndex].originalText!;

    const { start_position, end_position, corrected_text } = fix;
    updatedText =
      updatedText.slice(0, start_position) + corrected_text + updatedText.slice(end_position);

    const lengthDiff = corrected_text.length - (end_position - start_position);

    setGrammarResult(prev => {
      const textResult = prev[textId] || {};
      const updatedFixes =
        textResult.grammar_fixes?.filter(
          (f: any) => !(f.start_position === start_position && f.end_position === end_position)
        ) ?? [];

      const adjustedFixes = updatedFixes.map((fix: any) => {
        if (fix.start_position >= end_position) {
          return {
            ...fix,
            start_position: fix.start_position + lengthDiff,
            end_position: fix.end_position + lengthDiff,
          };
        }
        return fix;
      });

      updateGrammarCorrectedText(textId, updatedText);
      return {
        ...prev,
        [textId]: { ...textResult, grammar_fixes: adjustedFixes },
      };
    });

    const newTexts = [...texts];
    newTexts[selectedIndex] = { ...newTexts[selectedIndex], originalText: updatedText };
    saveTextsToServer(newTexts);
    setTexts(newTexts);
  };

  const renderTextWithUnderlines = (text: string, grammarResultForText: any) => {
    let { grammar_fixes = [] } = grammarResultForText || {};
    const originalText = text;

    const textComponents = [];
    let lastIndex = 0;

    const allFixes = [...grammar_fixes].sort((a, b) => a.start_position - b.start_position);

    allFixes.forEach((fix, index) => {
      if (lastIndex < fix.start_position) {
        textComponents.push(
          <Text key={`normal-${index}`}>{originalText.slice(lastIndex, fix.start_position)}</Text>
        );
      }

      textComponents.push(
        <Text key={`underlined-${index}`} style={styles.fixUnderline}>
          {originalText.slice(fix.start_position, fix.end_position)}
        </Text>
      );
      lastIndex = fix.end_position;
    });

    if (lastIndex < originalText.length) {
      textComponents.push(<Text key={'normal-final'}>{originalText.slice(lastIndex)}</Text>);
    }

    return textComponents;
  };

  const handleLayoutStart = async () => {
    setIsSubmitting(true);
    try {
      router.push({ pathname: '/grammar-complete' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!editingTexts[selectedIndex];
  const activeTexts = texts[selectedIndex];
  const activeGrammarStatus = grammarStatus[activeTexts.id!];
  const activeGrammarResult = grammarResult[activeTexts.id!];
  return (
    <View style={styles.container}>
      <TopBar
        backHref="/story-editor"
        title={audioBook!.title}
        rightButtons={[
          {
            text: "I'm done reviewing",
            onPress: () => handleLayoutStart(),
            color: Colors.lightYellow,
            fontColor: Colors.black,
            isLoading: isSubmitting,
          },
          { text: 'Save', href: '/', color: Colors.baseBlue },
        ]}
      />
      <View style={styles.innerContainer}>
        <View>
          {/* TODO: we can probably create into a separate component since it will be use in multiple places */}
          <ScrollView style={styles.sidebarScrollView}>
            {texts.map((text, index) => (
              <PageThumbnail
                key={index}
                content={text}
                isSelected={selectedIndex === index}
                onPress={() => handleSelectContent(index, texts[index].id!)}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.editorContainer}>
          <Text style={styles.lastEdit}>Last edited: {new Date().toLocaleString()}</Text>
          <View style={styles.editButtonContainer}>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => handleEditStart(selectedIndex)}
                style={styles.editButton}
              >
                <FontAwesome5 name="pen" size={16} color={Colors.black} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.editCancelButton}
                  onPress={() => handleEditCancel(selectedIndex)}
                >
                  <Text style={styles.editCancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEditDone(selectedIndex)}
                  style={styles.editButton}
                >
                  <FontAwesome5 name="check" size={16} color={Colors.black} />
                  <Text style={styles.editButtonText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <ScrollView>
            {isEditing ? (
              <TextInput
                value={activeTexts.originalText}
                onChangeText={handleTextChange}
                style={styles.textInput}
                placeholderTextColor="#ccc"
                multiline
              />
            ) : (
              <Text style={styles.textInput}>
                {renderTextWithUnderlines(activeTexts.originalText!, activeGrammarResult)}
              </Text>
            )}
          </ScrollView>
        </View>
        <GrammarPanel
          isEditing={isEditing}
          activeGrammarStatus={activeGrammarStatus}
          activeGrammarResult={activeGrammarResult}
          isChecking={isChecking}
          activePage={activeTexts}
          applyFixesByContext={applyFixesByContext}
        />
      </View>
    </View>
  );
}
