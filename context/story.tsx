import { checkGrammar } from '@/services/service';
import {
  AudioBook,
  GrammarCheckProgress,
  GrammarCheckResult,
  GrammarCheckStatus,
  TextData,
} from '@/types/audiobook';
import React, { createContext, useContext, useState } from 'react';

type StoryContextType = {
  texts: TextData[];
  setTexts: React.Dispatch<React.SetStateAction<TextData[]>>;
  coverPage: any;
  setCoverPage: React.Dispatch<React.SetStateAction<any>>;
  audioBook?: AudioBook;
  setAudioBook: React.Dispatch<React.SetStateAction<AudioBook | undefined>>;
  audioBookEditionId: string;
  setAudioBookEditionId: React.Dispatch<React.SetStateAction<string>>;
  characterUids: string[];
  setCharacterUids: React.Dispatch<React.SetStateAction<string[]>>;
  grammarStatus: { [textId: string]: GrammarCheckStatus };
  setGrammarStatus: React.Dispatch<React.SetStateAction<{ [textId: string]: GrammarCheckStatus }>>;
  resetGrammarStatusOnEdit: (textId: string) => void;
  checkTextGrammar: (text: string, textId: string) => Promise<void>;
  isChecking: (textId: string) => boolean;
  grammarResult: { [textId: string]: GrammarCheckResult };
  setGrammarResult: React.Dispatch<React.SetStateAction<{ [textId: string]: GrammarCheckResult }>>;
  clearData: any;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioBookEditionId, setAudioBookEditionId] = useState<string>('');
  const [audioBook, setAudioBook] = useState<AudioBook>();
  const [texts, setTexts] = useState<TextData[]>([]);
  const [coverPage, setCoverPage] = useState<any>();
  const [characterUids, setCharacterUids] = useState<string[]>([]);

  // Grammar 상태
  const [grammarStatus, setGrammarStatus] = useState<{
    [textId: string]: GrammarCheckStatus;
  }>({});
  const [grammarResult, setGrammarResult] = useState<{
    [textId: string]: { grammar_fixes?: any[] };
  }>({});

  const updateGrammarStatus = (textId: string, updatedStatus: Partial<GrammarCheckStatus>) => {
    setGrammarStatus(prev => {
      return {
        ...prev,
        [textId]: { ...grammarStatus[textId], ...updatedStatus },
      };
    });
  };

  const resetGrammarStatusOnEdit = (textId: string) => {
    updateGrammarStatus(textId, { checked: false });
    setGrammarResult(prev => ({ ...prev, [textId]: {} }));
  };

  // 페이지별 grammar check 실행 함수
  const checkTextGrammar = async (text: string, textId: string) => {
    try {
      if (
        grammarStatus[textId]?.status === GrammarCheckProgress.Checking ||
        grammarStatus[textId]?.status === GrammarCheckProgress.Done
      ) {
        console.log('이미 체크 중이거나 완료됨:', textId);
        return;
      }

      if (!text.trim()) return;

      updateGrammarStatus(textId, { status: GrammarCheckProgress.Checking });
      const result = await checkGrammar(text); // 기존 API 호출

      // 결과 저장
      setGrammarResult(prev => ({ ...prev, [textId]: result }));
      updateGrammarStatus(textId, {
        status: GrammarCheckProgress.Done,
        checked: true,
        originalText: text,
      });
    } catch (error) {
      console.error('Grammar check error:', error);
    }
  };

  // 페이지별 로딩 상태 확인 함수
  const isChecking = (textId: string) =>
    grammarStatus[textId]?.status === GrammarCheckProgress.Checking;

  // 데이터 초기화 함수
  const clearData = () => {
    setTexts([]);
    setCoverPage(undefined);
    setAudioBook(undefined);
    setAudioBookEditionId('');
    setGrammarStatus({});
    setGrammarResult({});
  };

  return (
    <StoryContext.Provider
      value={{
        texts,
        setTexts,
        audioBook,
        setAudioBook,
        audioBookEditionId,
        setAudioBookEditionId,
        characterUids,
        setCharacterUids,
        grammarStatus,
        setGrammarStatus,
        resetGrammarStatusOnEdit,
        checkTextGrammar,
        isChecking,
        grammarResult,
        setGrammarResult,
        coverPage,
        setCoverPage,
        clearData,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};
export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
