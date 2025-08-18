import RoundedButton from "@/components/RoundedButton";
import { Colors } from "@/constants/Colors";
import { createBook } from "@/services/service";
import { styles } from "@/src/styles/select-genre/styles.module";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
const GENRES = [
  "Picture",
  "Everyday life",
  "Rhyming",
  "Imaginative",
  "Social-emotional",
  "Interactive",
  "Others",
];

export default function GenreSelectorScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const { title } = useLocalSearchParams<{ title: string }>();

  const handleStart = async () => {
    try {
      if (!selected) return;
      const result = await createBook(title, selected!);
      const audioBookEditionId = result.edition.id;
      const audioBookEditionFirstPageId = result.page.id;
      router.push({
        pathname: "/story-editor",
        params: { audioBookEditionId, audioBookEditionFirstPageId, title },
      });
    } catch (error) {
      console.error("❌ 저장 실패 handleStart", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Text style={styles.title}>Select a genre</Text>

      <ScrollView
        contentContainerStyle={styles.genreList}
        showsVerticalScrollIndicator={false}
      >
        {GENRES.map((genre) => {
          const isSelected = selected === genre;
          return (
            <TouchableOpacity
              key={genre}
              onPress={() => setSelected(genre)}
              style={[styles.genreButton, isSelected && styles.genreSelected]}
            >
              <Text
                style={[
                  styles.genreText,
                  isSelected && styles.genreTextSelected,
                ]}
              >
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
          onPress={handleStart}
          fontColor={Colors.black}
        />
      </View>
    </View>
  );
}
