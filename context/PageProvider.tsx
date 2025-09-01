import { CanvasImageItem, CanvasItem, CanvasTextItem, Page } from '@/types/audiobook';
import React, { createContext, useContext, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type NewTextData = Omit<CanvasTextItem, 'id'>;
type NewImageData = Omit<CanvasImageItem, 'id' | 'linkedTextId'>;

type PageContextType = {
  pages: Page[];
  currentPageIndex: number;
  selectedItemId: string | null;
  currentPage: Page | undefined;
  setSelectedItemId: React.Dispatch<React.SetStateAction<string | null>>;
  addPage: () => void;
  goToPage: (index: number) => void;
  updateItemOnCurrentPage: (itemId: string, updates: Partial<CanvasItem>) => void;
  addTextAndImagePairToCurrentPage: (textData: NewTextData, imageData: NewImageData) => void;
  removeItemPairFromCurrentPage: (itemId: string) => CanvasTextItem | undefined;
  removeImageFromCurrentPage: (imageId: string) => void;
  // Image generation tries management per text (scoped by edition + originalTextId)
  getOrInitImageTries: (
    audioBookEditionId: string | undefined,
    originalTextId: string,
    initialTries: number
  ) => number;
  decrementImageTries: (audioBookEditionId: string | undefined, originalTextId: string) => number;
  // Persist generating state across modal open/close
  isGeneratingImage: (audioBookEditionId: string | undefined, originalTextId: string) => boolean;
  setGeneratingImage: (
    audioBookEditionId: string | undefined,
    originalTextId: string,
    isLoading: boolean
  ) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

const initialPages: Page[] = [{ id: uuidv4(), items: [] }];

// Provider 컴포넌트
export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  // Persist mapping from originalTextId -> static pairIndex so re-adding reuses the number
  const [pairIndexByOriginalId, setPairIndexByOriginalId] = useState<Record<string, number>>({});
  // Persist image generation tries across modal open/close and item removal
  const [imageGenerationTries, setImageGenerationTries] = useState<Record<string, number>>({});
  // Persist in-flight generating state across modal open/close
  const [imageGenerationInFlight, setImageGenerationInFlight] = useState<Record<string, boolean>>(
    {}
  );

  const currentPage = pages[currentPageIndex];

  // 새 페이지 추가 함수
  const addPage = () => {
    const newPage: Page = { id: uuidv4(), items: [] };
    setPages(prevPages => [...prevPages, newPage]);
    setCurrentPageIndex(pages.length);
    setSelectedItemId(null);
  };

  // 특정 인덱스의 페이지로 이동하는 함수
  const goToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      setCurrentPageIndex(index);
      setSelectedItemId(null);
    }
  };

  // 현재 페이지의 특정 아이템을 업데이트하는 함수
  const updateItemOnCurrentPage = (itemId: string, updates: Partial<CanvasItem>) => {
    // 현재 페이지가 없으면 아무것도 하지 않음
    if (!currentPage) return;

    // 1. 현재 페이지의 아이템 목록을 순회하며 해당 아이템을 찾아 업데이트
    const newItems = currentPage.items.map(item =>
      item.id === itemId ? ({ ...item, ...updates } as CanvasItem) : item
    );

    // 2. 전체 페이지 목록을 순회하며 현재 페이지를 업데이트된 아이템 목록을 가진 새 페이지 객체로 교체
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? { ...page, items: newItems } : page
    );

    // 3. 페이지 목록 상태를 업데이트
    setPages(updatedPages);
  };

  // 텍스트/이미지 쌍을 한 번의 상태 업데이트로 추가하는 새 함수
  const addTextAndImagePairToCurrentPage = (textData: NewTextData, imageData: NewImageData) => {
    if (!currentPage) return;

    // Count existing text and image items
    const existingTextCount = currentPage.items.filter(item => item.type === 'text').length;
    const existingImageCount = currentPage.items.filter(item => item.type === 'image').length;

    // Calculate offset
    const offset = 0.01 * (existingTextCount + existingImageCount);

    // 1. 텍스트 아이템과 이미지 아이템을 모두 미리 생성합니다.
    const newTextItem: CanvasTextItem = {
      ...textData,
      id: uuidv4(),
      x: (textData.x ?? 0) + offset,
      y: (textData.y ?? 0) + offset,
    };
    // Determine pair index: reuse if this originalTextId was seen before
    let assignedPairIndex = pairIndexByOriginalId[textData.originalTextId];
    if (!assignedPairIndex) {
      // Assign the next global static pair index (1-based) across ALL pages
      const allPairIndices = pages
        .flatMap(p =>
          p.items.map(i => (i.type === 'text' ? i.pairIndex : (i as CanvasImageItem).pairIndex))
        )
        .filter((n): n is number => typeof n === 'number');
      assignedPairIndex = (allPairIndices.length ? Math.max(...allPairIndices) : 0) + 1;
      setPairIndexByOriginalId(prev => ({ ...prev, [textData.originalTextId]: assignedPairIndex! }));
    }

    newTextItem.pairIndex = assignedPairIndex;

    const newImageItem: CanvasImageItem = {
      ...imageData,
      id: uuidv4(),
      linkedTextId: newTextItem.id,
      x: (imageData.x ?? 0) + offset,
      y: (imageData.y ?? 0) + offset,
    };
    newImageItem.pairIndex = assignedPairIndex;

    // 2. 두 아이템을 현재 페이지 아이템 목록에 한 번에 추가합니다.
    const newItems = [...currentPage.items, newImageItem, newTextItem];

    // 3. 페이지 목록 상태를 단 한 번만 업데이트합니다.
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? { ...page, items: newItems } : page
    );

    setPages(updatedPages);
    // 새로 추가된 텍스트 아이템을 선택 상태로 만듭니다.
    setSelectedItemId(newTextItem.id);
  };

  // 현재 페이지에서 ID가 일치하는 이미지만 제거하는 함수
  const removeImageFromCurrentPage = (imageId: string) => {
    if (!currentPage) return;

    // 1. 현재 페이지의 아이템 목록에서 imageId와 다른 아이템들만 남깁니다.
    const itemsToKeep = currentPage.items.filter(item => item.id !== imageId);

    // 2. 전체 페이지 목록을 업데이트합니다.
    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? { ...page, items: itemsToKeep } : page
    );

    // 3. 상태를 업데이트하고, 선택 상태를 초기화합니다.
    setPages(updatedPages);
    setSelectedItemId(null);
  };

  // 현재 페이지에서 아이템 쌍을 제거하고, 되돌릴 텍스트 데이터를 반환하는 함수
  const removeItemPairFromCurrentPage = (itemId: string): CanvasTextItem | undefined => {
    if (!currentPage) return undefined;

    const itemToRemove = currentPage.items.find(item => item.id === itemId);
    if (!itemToRemove) return undefined;

    let textItemToReturn: CanvasTextItem | undefined;
    let itemsToKeep: CanvasItem[];

    if (itemToRemove.type === 'text') {
      textItemToReturn = itemToRemove;
      // 텍스트를 제거할 땐, 연결된 이미지도 함께 제거
      itemsToKeep = currentPage.items.filter(
        item => item.id !== itemId && (item.type === 'text' || item.linkedTextId !== itemId)
      );
    } else {
      // itemToRemove.type === 'image'
      const linkedText = currentPage.items.find(item => item.id === itemToRemove.linkedTextId);
      textItemToReturn = linkedText?.type === 'text' ? linkedText : undefined;
      itemsToKeep = currentPage.items.filter(
        item => item.id !== itemId && item.id !== itemToRemove.linkedTextId
      );
    }

    const updatedPages = pages.map((page, index) =>
      index === currentPageIndex ? { ...page, items: itemsToKeep } : page
    );

    setPages(updatedPages);
    setSelectedItemId(null);

    // Preserve mapping from originalTextId to pairIndex if we have it
    if (textItemToReturn?.originalTextId && textItemToReturn?.pairIndex) {
      const originalId = textItemToReturn.originalTextId;
      const index = textItemToReturn.pairIndex;
      setPairIndexByOriginalId(prev => ({ ...prev, [originalId]: index }));
    }

    return textItemToReturn;
  };

  const makeTriesKey = (audioBookEditionId: string | undefined, originalTextId: string) => {
    return `${audioBookEditionId ?? 'no-edition'}:${originalTextId}`;
  };

  const getOrInitImageTries = (
    audioBookEditionId: string | undefined,
    originalTextId: string,
    initialTries: number
  ): number => {
    const key = makeTriesKey(audioBookEditionId, originalTextId);
    if (imageGenerationTries[key] === undefined) {
      setImageGenerationTries(prev => ({ ...prev, [key]: initialTries }));
      return initialTries;
    }
    return imageGenerationTries[key];
  };

  const decrementImageTries = (
    audioBookEditionId: string | undefined,
    originalTextId: string
  ): number => {
    const key = makeTriesKey(audioBookEditionId, originalTextId);
    let nextValue = 0;
    setImageGenerationTries(prev => {
      const current = prev[key] ?? 0;
      nextValue = Math.max(0, current - 1);
      return { ...prev, [key]: nextValue };
    });
    return nextValue;
  };

  const isGeneratingImage = (
    audioBookEditionId: string | undefined,
    originalTextId: string
  ): boolean => {
    const key = makeTriesKey(audioBookEditionId, originalTextId);
    return !!imageGenerationInFlight[key];
  };

  const setGeneratingImage = (
    audioBookEditionId: string | undefined,
    originalTextId: string,
    isLoading: boolean
  ) => {
    const key = makeTriesKey(audioBookEditionId, originalTextId);
    setImageGenerationInFlight(prev => ({ ...prev, [key]: isLoading }));
  };

  const value = {
    pages,
    currentPageIndex,
    selectedItemId,
    currentPage,
    setSelectedItemId,
    addPage,
    goToPage,
    updateItemOnCurrentPage,
    addTextAndImagePairToCurrentPage,
    removeItemPairFromCurrentPage,
    removeImageFromCurrentPage,
    getOrInitImageTries,
    decrementImageTries,
    isGeneratingImage,
    setGeneratingImage,
  };

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
};
