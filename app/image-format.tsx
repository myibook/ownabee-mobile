import CanvasDragOverlay from '@/components/CanvasDragOverlay';
import ImageGenerationModal from '@/components/ImageGenerationModal';
import TopBar from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useStory } from '@/context/story';
import { fetchTextsByEditionId, savePagesLayout } from '@/services/service';
import { styles } from '@/src/styles/image-format/styles.module';
import { CanvasImageItem, CanvasItem, CanvasTextItem, TextData } from '@/types/audiobook';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel1,
  PreviewText,
  Swatches,
} from 'reanimated-color-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DraggableItem from '../components/DraggableItem';
import PageThumbnailList from '../components/PageThumbnailList';
import Sidebar from '../components/Sidebar';
import { usePages } from '../context/PageProvider';

const CANVAS_ASPECT_RATIO = 4 / 5;

const ASPECT_RATIOS = { '16:9': 16 / 9, '4:3': 4 / 3, '1:1': 1, '9:16': 9 / 16 };

// Map display aspect ratios to generation ratios
const GENERATION_RATIOS: { [key: string]: string } = {
  '16:9': '16:9',
  '4:3': '1:1', // 4:3 maps to square for generation
  '1:1': '1:1',
  '9:16': '9:16',
};

const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

export default function ImageFormatScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [isModalVisible, setModalVisible] = useState(false);
  const [showDragOverlay, setShowDragOverlay] = useState(false);
  const [showSnapOverlay, setShowSnapOverlay] = useState(false);
  const [sidebarTexts, setSidebarTexts] = useState<TextData[]>([]);
  const [allOriginalTexts, setAllOriginalTexts] = useState<TextData[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const [visibleColorPicker, setVisibleColorPicker] = useState<null | 'text' | 'background'>(null);
  const [resultColor, setResultColor] = useState(customSwatches[0]);
  const currentColor = useSharedValue(customSwatches[0]);

  const [fontSizeItems, setFontSizeItems] = useState<{ label: string; value: number }[]>([]);

  const {
    pages,
    currentPage,
    currentPageIndex,
    selectedItemId,
    setSelectedItemId,
    addTextAndImagePairToCurrentPage,
    updateItemOnCurrentPage,
    removeItemPairFromCurrentPage,
    removeImageFromCurrentPage,
  } = usePages();

  const { audioBookEditionId, audioBook } = useStory();

  useEffect(() => {
    const loadTexts = async () => {
      if (!audioBookEditionId) return;
      const fetchedTexts = await fetchTextsByEditionId(audioBookEditionId);
      const existingTextIds = pages.flatMap(page =>
        page.items.filter(item => item.type === 'text').map(item => item.originalTextId)
      );
      const mappedTexts: TextData[] = fetchedTexts
        .sort((a, b) => a.order - b.order)
        .map(t => ({
          id: t.id,
          audioBookEditionId: t.audioBookEditionId,
          order: t.order,
          image: t.image,
          content: t.originalText ?? '',
        }));

      const filteredTexts = mappedTexts.filter(t => !existingTextIds.includes(t.id!));

      setAllOriginalTexts(mappedTexts);
      setSidebarTexts(filteredTexts);
    };
    loadTexts();
  }, [audioBookEditionId]);

  useEffect(() => {
    const generateFontSizeItems = () => {
      const min = 12;
      const max = 200;
      const step = 2;
      const sizes = [];
      for (let i = min; i <= max; i += step) {
        sizes.push({ label: `${i}`, value: i });
      }
      return sizes;
    };
    setFontSizeItems(generateFontSizeItems());
  }, []);

  const { canvasWidth, canvasHeight } = useMemo(() => {
    // Exclude sidebar (200) + page list (120) width
    const availableWidth = screenWidth - 200 - 120;
    const screenAspectRatio = availableWidth / screenHeight;
    let canvasWidth, canvasHeight;

    if (screenAspectRatio > CANVAS_ASPECT_RATIO) {
      canvasHeight = screenHeight * 0.9 - 70;
      canvasWidth = canvasHeight * CANVAS_ASPECT_RATIO;
    } else {
      canvasWidth = availableWidth * 0.9;
      canvasHeight = canvasWidth / CANVAS_ASPECT_RATIO;
    }
    return { canvasWidth, canvasHeight };
  }, [screenWidth, screenHeight]);

  const handleAddTextToCanvas = (textToAdd: TextData) => {
    if (!textToAdd.id) {
      console.warn('텍스트에 ID가 없어 캔버스에 추가할 수 없습니다.');
      return;
    }

    if (
      currentPage?.items.some(
        item =>
          (item.type === 'image' && item.linkedTextId === textToAdd.id) || item.id === textToAdd.id
      )
    )
      return;

    const currentTextOrder = textToAdd.order;

    for (let i = 0; i < currentPageIndex; i++) {
      const page = pages[i];

      // CanvasTextItem 타입으로 필터링 및 타입 단언
      const pageCanvasTextItems = page.items.filter(
        (item): item is CanvasTextItem => item.type === 'text'
      );

      // 현재 추가하려는 텍스트의 order보다 높은 order를 가진 텍스트가 이전 페이지에 있는지 확인
      const hasHigherOrderInPreviousPage = pageCanvasTextItems.some(
        item => item.order > currentTextOrder
      );

      if (hasHigherOrderInPreviousPage) {
        const higherOrderText = pageCanvasTextItems.find(item => item.order > currentTextOrder);

        if (higherOrderText) {
          const higherOrderContent = higherOrderText.content || '알 수 없는 텍스트';

          Alert.alert(
            '순서 오류',
            `텍스트 "${textToAdd.content?.substring(0, 20) || '...'}"의 순서(${
              currentTextOrder + 1
            })는 이전 페이지에 있는 텍스트의 순서보다 높을 수 없습니다. (이전 페이지에 순서 ${
              higherOrderText?.order + 1
            }인 "${higherOrderContent.substring(0, 20)}..." 텍스트가 있습니다.)`
          );
          return; // 추가를 중단하고 롤백
        }
      }
    }

    for (let i = currentPageIndex + 1; i < pages.length; i++) {
      const page = pages[i];
      const pageCanvasTextItems = page.items.filter(
        (item): item is CanvasTextItem => item.type === 'text'
      );

      const hasLowerOrderInLaterPage = pageCanvasTextItems.some(
        item => item.order < currentTextOrder
      );

      if (hasLowerOrderInLaterPage) {
        const lowerOrderText = pageCanvasTextItems.find(item => item.order < currentTextOrder);

        if (lowerOrderText) {
          const lowerOrderContent = lowerOrderText.content || '알 수 없는 텍스트';

          Alert.alert(
            '순서 오류',
            `텍스트 "${textToAdd.content?.substring(0, 20) || '...'}"의 순서(text number : ${
              currentTextOrder + 1
            })는 이후 페이지에 있는 텍스트의 순서보다 낮을 수 없습니다. (이후 페이지에 순서 ${
              lowerOrderText.order + 1
            }인 "${lowerOrderContent.substring(0, 20)}..." 텍스트가 있습니다.)`
          );
          return;
        }
      }
    }

    const initialTextWidthRatio = 0.8;

    addTextAndImagePairToCurrentPage(
      {
        type: 'text',
        originalTextId: textToAdd.id,
        order: textToAdd.order,
        content: textToAdd.content || '',
        x: 0.1,
        y: 0.75,
        width: initialTextWidthRatio,
        height: 0.2,
        originalWidth: initialTextWidthRatio,
        baseFontSize: 16,
        minFontSize: 10,
      },
      // 2. Image item data (ratio)
      {
        type: 'image',
        x: 0.1,
        y: 0.05,
        width: 0.8,
        aspectRatio: ASPECT_RATIOS['1:1'], // Default to square for new images
      }
    );

    setSidebarTexts(prev => prev.filter(t => t.id !== textToAdd.id));
  };

  const changeAspectRatio = (ratioKey: keyof typeof ASPECT_RATIOS) => {
    if (!selectedItemId) return;
    const newRatio = ASPECT_RATIOS[ratioKey];
    
    // if changing to 9:16 and new height exceeds canvas height, adjust width instead
    const currentItem = selectedItem as CanvasImageItem;
    const newHeight = currentItem.width / newRatio;
    if (newRatio === 9 / 16 && newHeight > 1) {
      const newWidth = currentItem.width * newRatio;
      updateItemOnCurrentPage(selectedItemId, {
        aspectRatio: newRatio,
        width: newWidth,
        height: undefined,
      });
    } else {
      updateItemOnCurrentPage(selectedItemId, { 
        aspectRatio: newRatio,
        height: undefined,
      });
    }
  };

  // allow freeform resizing
  const removeAspectRatioConstraint = () => {
    if (!selectedItemId || selectedItem?.type !== 'image') return;
    
    // width and height are relative to canvas so we need to calculate
    // height based on current width and aspect ratio and canvas aspect ratio
    const currentItem = selectedItem as CanvasImageItem;
    const newHeight = currentItem.width / (currentItem.aspectRatio! / CANVAS_ASPECT_RATIO);
    updateItemOnCurrentPage(selectedItemId, { 
      aspectRatio: undefined,
      height: newHeight,
    });
  };

  // Logic to find the currently selected item
  const selectedItem = useMemo(
    // Find in currentPage.items
    () => currentPage?.items.find(item => item.id === selectedItemId),
    [currentPage, selectedItemId]
  );

  const selectedOriginalTextId = useMemo(() => {
    if (!currentPage || !selectedItemId) return undefined;
    const target = currentPage.items.find(i => i.id === selectedItemId);
    if (!target) return undefined;
    if (target.type === 'text') return target.originalTextId;
    if (target.type === 'image') {
      const linked = currentPage.items.find(i => i.id === target.linkedTextId);
      return linked && linked.type === 'text' ? linked.originalTextId : undefined;
    }
    return undefined;
  }, [currentPage, selectedItemId]);

  // Get the generation ratio for the selected image item
  const getGenerationRatio = (item: CanvasItem): string => {
    if (item.type !== 'image') return '1:1';

    // Find the closest aspect ratio match
    const aspectRatio = (item as CanvasImageItem).aspectRatio;
    if (!aspectRatio) return '1:1';

    const ratioKey = Object.keys(ASPECT_RATIOS).find(
      key => Math.abs(ASPECT_RATIOS[key as keyof typeof ASPECT_RATIOS] - aspectRatio) < 0.01
    );

    return ratioKey ? GENERATION_RATIOS[ratioKey] || '1:1' : '1:1';
  };

  // Handler function to process rollback logic
  const handleRollbackItem = (itemToRollback: CanvasItem) => {
    // 1. Call the Provider function to remove the item pair from the page and receive the removed text info
    const removedTextItem = removeItemPairFromCurrentPage(itemToRollback.id);
    if (removedTextItem) {
      const originalTextData = allOriginalTexts.find(t => t.id === removedTextItem.originalTextId);

      if (originalTextData && !sidebarTexts.some(st => st.id === originalTextData.id)) {
        setSidebarTexts(prev => [...prev, originalTextData].sort((a, b) => a.order - b.order));
      }
    }
  };

  const handleSaveLayout = async () => {
    if (!audioBookEditionId || pages.length === 0) {
      alert('No data to save.');
      return;
    }

    setIsSaving(true);
    try {
      await savePagesLayout(audioBookEditionId, pages);
    } catch (error) {
      alert('Failed to save layout. Please try again.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverEditStart = async () => {
    if (sidebarTexts.length > 0) {
      Alert.alert('', '모든 텍스트를 캔버스에 추가해야만 다음 단계로 진행할 수 있습니다.');
    } else {
      setIsSaving(true);
      try {
        pages.forEach(page => {
          page.items = page.items.filter(item => !(item.type === 'image' && !item.imageUrl));
        });
        await savePagesLayout(audioBookEditionId, pages);
        router.push({
          pathname: '/generate-image-complete',
        });
      } catch (error) {
        Alert.alert('저장 실패', '레이아웃 저장 중 오류가 발생했습니다.');
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const onColorChange = (color: ColorFormatsObject) => {
    'worklet';
    currentColor.value = color.hex;
  };

  const onColorPick = (color: ColorFormatsObject) => {
    setResultColor(color.hex);
    if (selectedItemId && selectedItem?.type === 'text') {
      const updates: Partial<CanvasTextItem> = {};
      if (visibleColorPicker === 'text') {
        updates.color = color.hex;
      } else if (visibleColorPicker === 'background') {
        updates.backgroundColor = color.hex;
      }
      updateItemOnCurrentPage(selectedItemId, updates);
    }
    setVisibleColorPicker(null); // This closes the modal
  };

  // Map from textId to its static pairIndex stored on items
  const pairIndexByKey = React.useMemo(() => {
    const map: Record<string, number> = {};
    if (!currentPage) return map;
    for (const it of currentPage.items) {
      if (it.type === 'text' && it.pairIndex) map[it.id] = it.pairIndex;
    }
    return map;
  }, [currentPage]);

  return (
    <>
      <View style={styles.container}>
        <TopBar
          backHref="/grammar-check"
          title={audioBook!.title}
          rightButtons={[
            {
              text: "I'm done adding images",
              onPress: () => handleCoverEditStart(),
              color: Colors.lightYellow,
              isLoading: isSaving,
              fontColor: Colors.black,
            },
            {
              text: 'Save',
              color: Colors.baseBlue,
              onPress: () => handleSaveLayout(),
            },
          ]}
        />

        <View style={styles.pageContainer}>
          {/* Render page thumbnail list component */}
          <PageThumbnailList canvasWidth={canvasWidth} />
          <View style={styles.mainContent}>
            <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}>
              {currentPage?.items.map(item => {
                if (item.type === 'text') {
                  return (
                    <DraggableItem
                      key={item.id}
                      itemType="text"
                      badgeText={String(pairIndexByKey[item.id] ?? '')}
                      content={item.content}
                      initialX={item.x * canvasWidth}
                      initialY={item.y * canvasHeight}
                      initialWidth={item.width * canvasWidth}
                      originalWidth={item.originalWidth * canvasWidth}
                      initialHeight={item.height * canvasHeight}
                      onResizeEnd={updates => {
                        const relativeUpdates: any = {};
                        if (updates.x !== undefined) relativeUpdates.x = updates.x / canvasWidth;
                        if (updates.y !== undefined) relativeUpdates.y = updates.y / canvasHeight;
                        if (updates.width !== undefined) relativeUpdates.width = updates.width / canvasWidth;
                        if (updates.height !== undefined) relativeUpdates.height = updates.height / canvasHeight;
                        if (updates.originalWidth !== undefined) relativeUpdates.originalWidth = updates.originalWidth / canvasWidth;
                        if (updates.baseFontSize !== undefined) relativeUpdates.baseFontSize = updates.baseFontSize;
                        updateItemOnCurrentPage(item.id, relativeUpdates);
                      }}
                      baseFontSize={item.baseFontSize}
                      minFontSize={item.minFontSize}
                      onDragEnd={({ x, y }) =>
                        updateItemOnCurrentPage(item.id, {
                          x: x / canvasWidth,
                          y: y / canvasHeight,
                        })
                      }
                      isSelected={item.id === selectedItemId}
                      onTap={() => setSelectedItemId(item.id)}
                      isResizable={true}
                      canvasWidth={canvasWidth}
                      canvasHeight={canvasHeight}
                      onRollbackPress={() => handleRollbackItem(item)}
                      fontWeight={item.fontWeight}
                      fontStyle={item.fontStyle}
                      color={item.color}
                      backgroundColor={item.backgroundColor}
                      setShowSnapOverlay={setShowSnapOverlay}
                    />
                  );
                }

                if (item.type === 'image') {
                  return (
                    <DraggableItem
                      key={item.id}
                      itemType="image"
                      badgeText={String(pairIndexByKey[item.linkedTextId] ?? '')}
                      imageUrl={(item as CanvasImageItem).imageUrl}
                      initialX={item.x * canvasWidth}
                      initialY={item.y * canvasHeight}
                      initialWidth={item.width * canvasWidth}
                      initialHeight={item.height ? item.height * canvasHeight : undefined}
                      aspectRatio={item.aspectRatio}
                      onDragEnd={({ x, y }) =>
                        updateItemOnCurrentPage(item.id, {
                          x: x / canvasWidth,
                          y: y / canvasHeight,
                        })
                      }
                      onResizeEnd={updates => {
                        const relativeUpdates: any = {};
                        if (updates.x !== undefined) relativeUpdates.x = updates.x / canvasWidth;
                        if (updates.y !== undefined) relativeUpdates.y = updates.y / canvasHeight;
                        if (updates.width) relativeUpdates.width = updates.width / canvasWidth;
                        if (updates.height && !item.aspectRatio) {
                          relativeUpdates.height = updates.height / canvasHeight;
                        }
                        updateItemOnCurrentPage(item.id, relativeUpdates);
                      }}
                      onImagePress={() => {
                        setSelectedItemId(item.id);
                        setModalVisible(true);
                      }}
                      isSelected={item.id === selectedItemId}
                      onTap={() => setSelectedItemId(item.id)}
                      isResizable={true}
                      canvasWidth={canvasWidth}
                      canvasHeight={canvasHeight}
                      onDeleteImagePress={() => removeImageFromCurrentPage(item.id)}
                      setShowSnapOverlay={setShowSnapOverlay}
                    />
                  );
                }
                return null;
              })}
              {/* overlay shown when dragging text onto canvas */}
              <CanvasDragOverlay
                visible={showDragOverlay}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
              />
              {showSnapOverlay && (
                <View style={styles.snapOverlay} />
              )}
            </View>
          </View>
          <Sidebar
            texts={sidebarTexts}
            onAddTextToCanvas={handleAddTextToCanvas}
            setShowDragOverlay={setShowDragOverlay}
          />

          {selectedItem && selectedItem.type === 'text' && (
            <View style={styles.controls}>
              {/* 볼드/이태릭 버튼 */}
              <TouchableOpacity
                onPress={() => {
                  const currentFontWeight = (selectedItem as CanvasTextItem).fontWeight;
                  const newFontWeight = currentFontWeight === 'bold' ? 'normal' : 'bold';
                  updateItemOnCurrentPage(selectedItem.id, {
                    fontWeight: newFontWeight,
                  });
                }}
                style={[
                  styles.styleButton,
                  (selectedItem as CanvasTextItem).fontWeight === 'bold' &&
                    styles.styleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    {
                      fontWeight:
                        (selectedItem as CanvasTextItem).fontWeight === 'bold' ? 'bold' : 'normal',
                    },
                  ]}
                >
                  B
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const currentFontStyle = (selectedItem as CanvasTextItem).fontStyle;
                  const newFontStyle = currentFontStyle === 'italic' ? 'normal' : 'italic';
                  updateItemOnCurrentPage(selectedItem.id, {
                    fontStyle: newFontStyle,
                  });
                }}
                style={[
                  styles.styleButton,
                  (selectedItem as CanvasTextItem).fontStyle === 'italic' &&
                    styles.styleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    {
                      fontStyle:
                        (selectedItem as CanvasTextItem).fontStyle === 'italic'
                          ? 'italic'
                          : 'normal',
                    },
                  ]}
                >
                  I
                </Text>
              </TouchableOpacity>

              {/* 텍스트 컬러 선택 버튼 */}
              <TouchableOpacity
                style={styles.paletteButton}
                onPress={() => setVisibleColorPicker('text')}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 25,
                    backgroundColor: (selectedItem as CanvasTextItem).color || 'black',
                  }}
                />
              </TouchableOpacity>

              {/* 배경 컬러 선택 버튼 */}
              <TouchableOpacity
                style={styles.paletteButton}
                onPress={() => setVisibleColorPicker('background')}
              >
                {(selectedItem as CanvasTextItem).backgroundColor ? (
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 25,
                      backgroundColor:
                        (selectedItem as CanvasTextItem).backgroundColor || '#FFFFFF00',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={require('../assets/images/highlighter.png')}
                      style={{
                        width: 27,
                        height: 27,
                      }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      source={require('../assets/images/highlighter.png')}
                      style={{
                        width: 27,
                        height: 27,
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}

          {selectedItem && selectedItem.type === 'image' && (
            <View style={styles.controls}>
              <Text style={styles.controlTitle}>Aspect Ratio:</Text>
              {Object.keys(ASPECT_RATIOS).map(key => {
                const isActive = (selectedItem as CanvasImageItem).aspectRatio === ASPECT_RATIOS[key as keyof typeof ASPECT_RATIOS];
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      if (!isActive) {
                        changeAspectRatio(key as keyof typeof ASPECT_RATIOS);
                      }
                    }}
                    style={styles.controlButton}
                  >
                    <Text style={{ color: isActive ? '#007AFF' : '#8E8E93' }}>{key}</Text>
                  </TouchableOpacity>
                )
              })}
              <View style={styles.controlDivider} />
              <TouchableOpacity
                key="free"
                onPress={() => {
                  if ((selectedItem as CanvasImageItem).aspectRatio !== undefined) {
                    removeAspectRatioConstraint();
                  }
                }}
                style={styles.controlButton}
              >
                <MaterialCommunityIcons
                  name="arrow-expand-all"
                  size={20}
                  color={(selectedItem as CanvasImageItem).aspectRatio === undefined ? '#007AFF' : '#8E8E93'}
                />
              </TouchableOpacity>
            </View>
          )}
          <ImageGenerationModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            initialTries={3}
            defaultPrompt={
              selectedItem?.type === 'image'
                ? ((
                    currentPage?.items.find(
                      item => item.id === selectedItem.linkedTextId && item.type === 'text'
                    ) as CanvasTextItem | undefined
                  )?.content ?? '')
                : ''
            }
            initialPrompt=""
            audioBookEditionId={audioBookEditionId}
            imageItemId={selectedItem?.type === 'image' ? selectedItem.id : undefined}
            initialRatio={selectedItem ? getGenerationRatio(selectedItem) : '1:1'}
            audioBookPageTextId={selectedOriginalTextId}
            onPick={uri => {
              if (!selectedItemId) return;
              updateItemOnCurrentPage(selectedItemId, { imageUrl: uri });
              setModalVisible(false);
            }}
          />
        </View>
      </View>
      <View style={styles.outerContainer}>
        <Modal visible={!!visibleColorPicker} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.pickerContainer}>
              <ColorPicker
                value={
                  visibleColorPicker === 'text'
                    ? (selectedItem as CanvasTextItem)?.color || '#000000'
                    : (selectedItem as CanvasTextItem)?.backgroundColor || '#FFFFFFFF'
                }
                sliderThickness={25}
                thumbSize={24}
                thumbShape="circle"
                onChange={onColorChange}
                onCompleteJS={onColorPick}
                style={styles.picker}
                boundedThumb
              >
                <Panel1 style={styles.panelStyle} />
                <HueSlider style={styles.sliderStyle} />
                <OpacitySlider style={styles.sliderStyle} />
                <Swatches
                  style={styles.swatchesContainer}
                  swatchStyle={styles.swatchStyle}
                  colors={customSwatches}
                />
                <PreviewText style={styles.previewTxt} colorFormat="hwba" />
              </ColorPicker>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
