import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/components/GrammarPanel/styles.module';
import { GrammarCheckResult, GrammarCheckStatus, TextData } from '@/types/audiobook';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface GrammarPanelProps {
  isEditing: boolean;
  activeGrammarStatus: GrammarCheckStatus;
  activeGrammarResult: GrammarCheckResult;
  isChecking: (id: string) => boolean;
  activePage: TextData;
  applyFixesByContext: (fix: any) => void;
}

const GrammarPanel: React.FC<GrammarPanelProps> = ({
  isEditing,
  activeGrammarStatus,
  activeGrammarResult,
  isChecking,
  activePage,
  applyFixesByContext,
}) => {
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.black} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  const renderCompleted = (message: string) => (
    <View style={styles.messageContainer}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );

  const renderGrammarFixes = () =>
    activeGrammarResult?.grammar_fixes?.map((fix, index) => (
      <View key={index} style={styles.fixItem}>
        <View>
          <Text style={styles.original}>{fix.original_incorrect_words}</Text>
          <Text style={styles.corrected}>{fix.corrected_text}</Text>
          <Text style={styles.explanation}>💡 {fix.explanation}</Text>
        </View>
        <TouchableOpacity
          onPress={() => applyFixesByContext(fix)}
          style={[styles.applyButton, isEditing && { opacity: 0.6 }]}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    ));

  const getPanelContent = () => {
    if (isChecking(activePage.id!)) {
      return renderLoading();
    }
    if (activeGrammarStatus?.checked && activeGrammarResult?.grammar_fixes?.length === 0) {
      return renderCompleted('All corrections have been completed.');
    }
    return <ScrollView style={styles.contentScrollView}>{renderGrammarFixes()}</ScrollView>;
  };

  const panelContent = getPanelContent();

  return (
    <View style={styles.container}>
      <View
        style={[styles.panel, isEditing && { opacity: 0.5 }]}
        pointerEvents={isEditing ? 'none' : 'auto'}
      >
        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Grammar Fixes</Text>
          </TouchableOpacity>
        </View>
        {panelContent}
      </View>
    </View>
  );
};

export default GrammarPanel;
