import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/components/DraggableText/styles.module';
import { useFonts } from '@expo-google-fonts/inter';

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalSelector from 'react-native-modal-selector';

import { AVAILABLE_FONTS, FONT_MAP } from '@/constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue } from 'react-native-reanimated';
import type { ColorFormatsObject } from 'reanimated-color-picker';
import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel1,
  Swatches,
} from 'reanimated-color-picker';
import DraggableTextInput from './DraggableTextInput';
import DraggableTextInput2 from './DraggableTextInput2';

const DEFAULT_FONT_SIZE = 30;
type TextItem = {
  id: number;
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  fontFamily: any;
  fontFamilyVal: string;
  x: number;
  y: number;
  fontWeight: string;
};

const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

type Props = {
  boundingBox: {
    width: number;
    height: number;
  };
  triggerSignal?: number;
  initialData?: {
    textItems: TextItem[];
    imageLayout?: { width: number; height: number };
    timestamp?: string;
  };
  textItems?: TextItem[];
  title: string;
  setTextItems?: React.Dispatch<React.SetStateAction<TextItem[]>>;
  openBackgroundColorPicker?: () => void;
};

export type DraggableText = {
  getTextItems: () => TextItem[];
  addTextInput: () => void;
};

const DraggableText = forwardRef<DraggableText, Props>(
  ({ boundingBox, triggerSignal, initialData, title }, ref) => {
    const [visibleColorPicker, setVisibleColorPicker] = useState<null | 'text' | 'background'>(
      null
    );
    const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
    const [selectedText, setSelectedText] = useState<TextItem | null>(null);
    const [openFontFamily, setOpenFontFamily] = useState(false);
    const [textItems, setTextItems] = useState<TextItem[]>([]);
    const [pickerColor, setPickerColor] = useState('');

    useImperativeHandle(ref, () => ({
      getTextItems: () => textItems,
      addTextInput: () => addTextInput(),
    }));

    useEffect(() => {
      if (initialData && initialData.textItems && initialData.textItems.length > 0) {
        setTextItems(initialData.textItems);
        if (initialData.textItems.length > 0) {
          setSelectedTextId(initialData.textItems[0].id);
          setSelectedText(initialData.textItems[0]);
        }
      } else if (!initialData) {
        const defaultTextItems = [
          {
            id: Date.now(),
            text: title,
            fontSize: DEFAULT_FONT_SIZE,
            color: 'black',
            backgroundColor: '',
            fontFamily: FONT_MAP['Gluten'].normal,
            fontFamilyVal: 'Gluten',
            fontWeight: 'normal',
            x: 100,
            y: 100,
          },
        ];
        setTextItems(defaultTextItems);
        setSelectedTextId(defaultTextItems[0].id);
        setSelectedText(defaultTextItems[0]);
      }
    }, [initialData]); // This will trigger whenever initialData changes

    // DropDownPicker 관련 상태
    const [fontSizeOpen, setFontSizeOpen] = useState(false);
    const [fontSizeValue, setFontSizeValue] = useState<number | null>(fontSize);
    const [fontSizeItems, setFontSizeItems] = useState<{ label: string; value: number }[]>([]);

    // color picker
    const [textResultColor, setTextResultColor] = useState('');
    const [backgroundResultColor, setBackgroundResultColor] = useState('');

    const currentColor = useSharedValue(customSwatches[0]);

    useEffect(() => {
      setSelectedTextId(null);
      setSelectedText(null);
    }, [triggerSignal]);

    const selectedIndex = fontSizeItems.findIndex(item => item.value === fontSize);

    const updateFontFamily = (newFontFamilyVal: string) => {
      if (selectedText !== null) {
        const fontFamily = FONT_MAP[newFontFamilyVal][selectedText.fontWeight];
        handleChange(selectedText.id, 'fontFamily', fontFamily);
        handleChange(selectedText.id, 'fontFamilyVal', newFontFamilyVal);
      }
    };

    let [fontsLoaded] = useFonts(AVAILABLE_FONTS);

    // runs on the ui thread on color change
    const onColorChange = (color: ColorFormatsObject) => {
      'worklet';
      currentColor.value = color.hex;
    };

    const onColorPick = (color: string) => {
      if (visibleColorPicker === 'text') {
        setTextResultColor(color);
        if (selectedTextId !== null) {
          handleChange(selectedTextId, 'color', color);
        }
      } else if (visibleColorPicker === 'background') {
        setBackgroundResultColor(color);
        if (selectedTextId !== null) {
          handleChange(selectedTextId, 'backgroundColor', color);
        }
      }

      setVisibleColorPicker(null);
    };

    useEffect(() => {
      const generateFontSizeItems = () => {
        const min = 30;
        const max = 150;
        const step = 15;
        const sizes = [];
        for (let i = min; i <= max; i += step) {
          sizes.push({ label: `${i}`, value: i });
        }
        return sizes;
      };

      setFontSizeItems(generateFontSizeItems());
      setFontSizeValue(fontSize);
    }, [fontSize]);

    const addTextInput = () => {
      setTextItems(prev => [
        ...prev,
        {
          id: Date.now(),
          text: title,
          fontSize: DEFAULT_FONT_SIZE,
          color: Colors.black,
          backgroundColor: '',
          fontFamily: FONT_MAP['Gluten'].normal,
          fontFamilyVal: 'Gluten',
          fontWeight: 'normal',
          x: 150,
          y: 150,
        },
      ]);
    };

    const handleChange = (id: number, key: keyof TextItem, value: any) => {
      setSelectedTextId(id);
      setTextItems(prev => prev.map(item => (item.id === id ? { ...item, [key]: value } : item)));
      setSelectedText(prev => (prev ? { ...prev, [key]: value } : prev));
    };

    const handlePositionChange = (id: number, x: number, y: number) => {
      setTextItems(prev => prev.map(item => (item.id === id ? { ...item, x, y } : item)));
    };

    const handleFocus = (id: number) => {
      setSelectedTextId(id);
      const focusedTextItem = textItems.find(item => item.id === id)!;
      setSelectedText(focusedTextItem);
      setFontSizeValue(focusedTextItem.fontSize);
    };

    const handleDelete = (id: number) => {
      setTextItems(prev => prev.filter(item => item.id !== id));
      setSelectedTextId(prevId => (prevId === id ? null : prevId));
    };

    if (!fontsLoaded) return <Text>폰트를 불러오는 중...</Text>;
    return (
      <>
        {!selectedText && (
          <Animated.View style={{ position: 'absolute' }}>
            {textItems.map(item => (
              <DraggableTextInput
                key={item.id}
                id={item.id}
                onPositionChange={handlePositionChange}
                initialX={item.x}
                initialY={item.y}
                triggerSignal={triggerSignal}
                text={item.text}
                onChangeText={text => handleChange(item.id, 'text', text)}
                onFocus={handleFocus}
                onDelete={() => handleDelete(item.id)}
                fontSize={item.fontSize}
                color={item.color}
                backgroundColor={item.backgroundColor}
                fontFamily={item.fontFamily}
                parentWidth={boundingBox?.width ?? 0}
                parentHeight={boundingBox?.height ?? 0}
                title={title}
              />
            ))}
          </Animated.View>
        )}
        {selectedText && (
          <View style={{ position: 'absolute' }}>
            {textItems.map(item => (
              <DraggableTextInput2
                key={item.id}
                id={item.id}
                autoFocus={selectedTextId === item.id}
                onPositionChange={handlePositionChange}
                initialX={item.x}
                initialY={item.y}
                triggerSignal={triggerSignal}
                text={item.text}
                onChangeText={text => handleChange(item.id, 'text', text)}
                onFocus={handleFocus}
                onDelete={() => handleDelete(item.id)}
                fontSize={item.fontSize}
                color={item.color}
                backgroundColor={item.backgroundColor}
                fontFamily={item.fontFamily}
                parentWidth={boundingBox?.width ?? 0}
                parentHeight={boundingBox?.height ?? 0}
                title={title}
              />
            ))}
          </View>
        )}

        {selectedText && (
          <View style={styles.controls}>
            <ModalSelector
              visible={openFontFamily}
              data={Object.keys(FONT_MAP).map(key => ({ key: key, label: key }))}
              onModalClose={({ key }) => {
                if (selectedText && key) updateFontFamily(key!);
                setOpenFontFamily(false);
              }}
              componentExtractor={item => (
                <Text
                  style={{
                    fontSize: 30,
                    fontFamily: FONT_MAP[item.key].normal,
                    alignSelf: 'center',
                  }}
                >
                  {item.label}
                </Text>
              )}
              optionContainerStyle={{
                width: 400,
                alignSelf: 'center',
              }}
              cancelStyle={{
                width: 400,
                alignSelf: 'center',
              }}
              cancelTextStyle={{
                fontSize: 30,
              }}
              customSelector={
                <TouchableOpacity onPress={() => setOpenFontFamily(true)}>
                  <MaterialCommunityIcons name="format-text" size={28} color="black" />
                </TouchableOpacity>
              }
            />

            {/* text color */}
            <TouchableOpacity
              style={styles.paletteButton}
              onPress={() => {
                if (selectedTextId !== null) {
                  const selected = textItems.find(item => item.id === selectedTextId);
                  if (selected) {
                    setTextResultColor(selected.color);
                    currentColor.value = selected.color;
                  }
                }
                setVisibleColorPicker('text');
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor:
                    selectedTextId !== null
                      ? textItems.find(item => item.id === selectedTextId)?.color || 'black'
                      : 'black',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paletteButton}
              onPress={() => {
                if (selectedTextId !== null) {
                  const selected = textItems.find(item => item.id === selectedTextId);
                  if (selected) {
                    setBackgroundResultColor(selectedText.backgroundColor);
                    currentColor.value = selected.backgroundColor || '#ffffff';
                  }
                }
                setVisibleColorPicker('background');
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 15,
                  backgroundColor:
                    selectedTextId !== null
                      ? textItems.find(item => item.id === selectedTextId)?.backgroundColor ||
                        'white'
                      : 'white',
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (selectedText) {
                  const newFontWeight = selectedText.fontWeight === 'bold' ? 'normal' : 'bold';
                  const fontFamily = FONT_MAP[selectedText.fontFamilyVal][newFontWeight];
                  handleChange(selectedText.id, 'fontWeight', newFontWeight);
                  handleChange(selectedText.id, 'fontFamily', fontFamily);
                }
              }}
              style={{
                paddingHorizontal: 12,
                marginHorizontal: 10,
                borderRadius: 8,
                justifyContent: 'center',
                height: 50,
              }}
            >
              <Text
                style={[
                  {
                    color: Colors.black,
                    fontSize: 28,
                  },
                  {
                    fontWeight: selectedText.fontWeight === 'bold' ? 'bold' : 'normal',
                  },
                ]}
              >
                B
              </Text>
            </TouchableOpacity>

            {/* font size */}
            <DropDownPicker
              open={fontSizeOpen}
              value={fontSizeValue}
              items={fontSizeItems}
              setOpen={setFontSizeOpen}
              setValue={setFontSizeValue}
              dropDownDirection="BOTTOM"
              onChangeValue={val => {
                if (typeof val === 'number') {
                  setFontSize(val);
                  if (selectedTextId !== null) {
                    handleChange(selectedTextId, 'fontSize', val);
                  }
                }
              }}
              setItems={setFontSizeItems}
              style={styles.dropdown}
              containerStyle={{
                width: 100,
                marginHorizontal: 10,
              }}
              showTickIcon={true}
              listMode="FLATLIST"
              flatListProps={{
                initialScrollIndex: selectedIndex >= 0 ? selectedIndex - 2 : 0,
                getItemLayout: (_, index) => ({
                  length: 40,
                  offset: 40 * index,
                  index,
                }),
              }}
              dropDownContainerStyle={{
                maxHeight: 200,
              }}
            />
          </View>
        )}
        <Modal visible={!!visibleColorPicker} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.pickerContainer}>
              <ColorPicker
                value={visibleColorPicker === 'text' ? textResultColor : backgroundResultColor}
                sliderThickness={25}
                thumbSize={24}
                thumbShape="circle"
                onCompleteJS={(color: any) => setPickerColor(color.hex)}
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
                <View style={styles.colorPickerButtonContainer}>
                  <TouchableOpacity
                    style={styles.colorPickerCloseButton}
                    onPress={() => {
                      setVisibleColorPicker(null);
                      setPickerColor('');
                    }}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.colorPickerCloseButton}
                    onPress={() => {
                      onColorPick(pickerColor);
                      setPickerColor('');
                    }}
                  >
                    <Text>OK</Text>
                  </TouchableOpacity>
                </View>
              </ColorPicker>
            </View>
          </View>
        </Modal>
      </>
    );
  }
);

export default DraggableText;
