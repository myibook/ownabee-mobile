import { Colors } from "@/constants/Colors";
import {
  BitcountGridDouble_400Regular,
  BitcountGridDouble_500Medium,
  BitcountGridDouble_800ExtraBold,
} from "@expo-google-fonts/bitcount-grid-double";
import {
  DancingScript_400Regular,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import {
  Inter_400Regular,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { MeowScript_400Regular } from "@expo-google-fonts/meow-script/400Regular";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSharedValue } from "react-native-reanimated";
import type { ColorFormatsObject } from "reanimated-color-picker";
import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel1,
  PreviewText,
  Swatches,
} from "reanimated-color-picker";
import DraggableTextInput from "./DraggableTextInput";
type TextItem = {
  id: number;
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  fontFamily: any;
};

const fontMap = {
  Inter: "Inter_400Regular",
  BitcountLight: "BitcountGridDouble_400Regular",
  BitcountMedium: "BitcountGridDouble_500Medium",
  BitcountBold: "BitcountGridDouble_800ExtraBold",
  Meow: "MeowScript_400Regular",
  DancingLight: "DancingScript_400Regular",
  DancingMedium: "DancingScript_600SemiBold",
  DancingBold: "DancingScript_700Bold",
  Dancing: "DancingScript_400Regular",
};

const customSwatches = new Array(6)
  .fill("#fff")
  .map(() => colorKit.randomRgbColor().hex());

export default function DraggableTextWithStyle() {
  const translateX = useSharedValue(100);
  const translateY = useSharedValue(100);
  const [visibleColorPicker, setVisibleColorPicker] = useState<
    null | "text" | "background"
  >(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("black");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);

  const [selectedFont, setSelectedFont] = useState<
    "Inter" | "BitcountLight" | "Meow" | "BitcountMedium" | "BitcountBold"
  >("Inter");
  const [textItems, setTextItems] = useState<TextItem[]>([
    {
      id: Date.now(),
      text: "",
      fontSize: 24,
      color: "black",
      backgroundColor: "",
      fontFamily: "Inter",
    },
  ]);

  // DropDownPicker 관련 상태
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [fontSizeValue, setFontSizeValue] = useState<number | null>(fontSize);
  const [fontSizeItems, setFontSizeItems] = useState<
    { label: string; value: number }[]
  >([]);

  const [open, setOpen] = useState(false);

  // color picker
  const [resultColor, setResultColor] = useState(customSwatches[0]);

  const currentColor = useSharedValue(customSwatches[0]);

  const selectedIndex = fontSizeItems.findIndex(
    (item) => item.value === fontSize
  );

  const [items, setItems] = useState([
    { label: "Bitcount", value: "Bitcount" },
    { label: "light", value: "BitcountLight", parent: "Bitcount" },
    { label: "Medium", value: "BitcountMedium", parent: "Bitcount" },
    { label: "Bold", value: "BitcountBold", parent: "Bitcount" },
    { label: "Dancing", value: "Dancing" },
    { label: "light", value: "DancingLight", parent: "Dancing" },
    { label: "Medium", value: "DancingMedium", parent: "Dancing" },
    { label: "Bold", value: "DancingBold", parent: "Dancing" },
  ]);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    BitcountGridDouble_400Regular,
    Inter_900Black,
    Inter_700Bold,
    MeowScript_400Regular,
    BitcountGridDouble_500Medium,
    BitcountGridDouble_800ExtraBold,
    DancingScript_400Regular,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  // runs on the ui thread on color change
  const onColorChange = (color: ColorFormatsObject) => {
    "worklet";
    currentColor.value = color.hex;
  };

  const onColorPick = (color: ColorFormatsObject) => {
    setResultColor(color.hex);

    if (visibleColorPicker === "text") {
      if (selectedTextId !== null) {
        handleChange(selectedTextId, "color", color.hex);
      }
      setColor(color.hex);
    } else if (visibleColorPicker === "background") {
      if (selectedTextId !== null) {
        handleChange(selectedTextId, "backgroundColor", color.hex);
      }
      setBackgroundColor(color.hex);
    }

    setVisibleColorPicker(null);
  };

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
    setFontSizeValue(fontSize);
  }, [fontSize]);

  const addTextInput = () => {
    setTextItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "",
        fontSize: 24,
        color: Colors.black,
        backgroundColor: "",
        fontFamily: fontMap[selectedFont],
      },
    ]);
  };

  const handleChange = (id: number, key: keyof TextItem, value: any) => {
    setSelectedTextId(id);
    setTextItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleFocus = (id: number) => {
    setSelectedTextId(id);
  };
  const handleDelete = (id: number) => {
    setTextItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedTextId((prevId) => (prevId === id ? null : prevId));
  };

  if (!fontsLoaded) return <Text>폰트를 불러오는 중...</Text>;

  return (
    <>
      {textItems.map((item) => (
        <DraggableTextInput
          key={item.id}
          id={item.id}
          text={item.text}
          onChangeText={(text) => handleChange(item.id, "text", text)}
          onFocus={handleFocus}
          onDelete={() => handleDelete(item.id)}
          fontSize={item.fontSize}
          color={item.color}
          backgroundColor={item.backgroundColor}
          fontFamily={item.fontFamily}
        />
      ))}

      {/* 📐 스타일 제어 UI */}
      {/* font family */}
      <View style={styles.controls}>
        <View style={{ width: 200 }}>
          <DropDownPicker
            open={open}
            value={selectedFont}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedFont}
            setItems={setItems}
            theme="LIGHT"
            multiple={false}
            mode="SIMPLE"
            dropDownDirection="TOP"
            style={styles.dropdown}
          />
        </View>

        {/* font size */}
        <DropDownPicker
          open={fontSizeOpen}
          value={fontSizeValue}
          items={fontSizeItems}
          setOpen={setFontSizeOpen}
          setValue={setFontSizeValue}
          dropDownDirection="TOP"
          onChangeValue={(val) => {
            if (typeof val === "number") {
              setFontSize(val);
              if (selectedTextId !== null) {
                handleChange(selectedTextId, "fontSize", val);
              }
            }
          }}
          setItems={setFontSizeItems}
          style={styles.dropdown}
          containerStyle={{
            width: 100,
            marginHorizontal: 10,
          }}
          placeholder="폰트 크기"
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
        {/* text color */}
        <TouchableOpacity
          style={styles.paletteButton}
          onPress={() => setVisibleColorPicker("text")}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 25,
              backgroundColor:
                selectedTextId !== null
                  ? textItems.find((item) => item.id === selectedTextId)
                      ?.color || "black"
                  : "black",
            }}
          />
        </TouchableOpacity>
        {/* background color */}
        <TouchableOpacity
          style={styles.paletteButton}
          onPress={() => setVisibleColorPicker("background")}
        >
          {backgroundColor ? (
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 25,
                backgroundColor:
                  selectedTextId !== null
                    ? textItems.find((item) => item.id === selectedTextId)
                        ?.backgroundColor || ""
                    : "",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/images/highlighter.png")}
                style={{
                  width: 27,
                  height: 27,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/images/highlighter.png")}
                style={{
                  width: 27,
                  height: 27,
                }}
              />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={addTextInput}
          style={{
            paddingHorizontal: 12,
            marginHorizontal: 10,
            borderRadius: 8,
            justifyContent: "center",
            borderColor: Colors.softGray,
            borderWidth: 1,
            height: 50,
          }}
        >
          <MaterialCommunityIcons name="format-text" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Modal visible={!!visibleColorPicker} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={resultColor}
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
    </>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    bottom: 20,
    left: 120,
    right: 120,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    height: 80,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  paletteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  picker: {
    gap: 20,
  },
  pickerContainer: {
    alignSelf: "center",
    width: 300,
    backgroundColor: "#eee",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewTxt: {
    color: "#020202FF",
    fontFamily: "Quicksand",
  },
  swatchesContainer: {
    alignItems: "center",
    flexWrap: "nowrap",
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  dropdown: {
    borderColor: Colors.primaryGray,
    height: 40,
  },
});
