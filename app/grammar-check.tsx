import PageThumbnail from "@/components/PageThumbnail";
import RoundedButton from "@/components/RoundedButton";
import TopBar from "@/components/TopBar";
import { Colors } from "@/constants/Colors";
import { useStory } from "@/context/story";
import { styles } from "@/src/styles/grammar-check/styles.module";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function GrammarCheckScreen() {
  const { pages, setPages } = useStory();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTextChange = (text: string) => {
    const newPages = [...pages];
    newPages[selectedIndex] = { ...newPages[selectedIndex], text };
    setPages(newPages);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <TopBar
        backHref="/story-editor"
        title="✏️"
        rightButtons={[
          {
            text: "I’m done reviewing",
            href: "/grammar-complete",
            color: Colors.lightYellow,
            fontColor: Colors.black,
          },
          {
            text: "Save",
            href: "/", // 필요시 onPress로 교체
            color: Colors.baseBlue,
          },
        ]}
      />

      {/* page list */}
      <View style={styles.sidebar}>
        <ScrollView
          style={{ width: 120, padding: 12, marginTop: 70 }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {pages.map((page, index) => (
            <PageThumbnail
              key={index}
              content={page}
              isSelected={selectedIndex === index}
              onPress={() => setSelectedIndex(index)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 본문 */}
      <View style={styles.editorContainer}>
        <Text style={styles.lastEdit}>
          Last edited: {new Date().toLocaleString()}
        </Text>
        <TextInput
          value={pages[selectedIndex]?.text}
          onChangeText={handleTextChange}
          style={styles.textInput}
          placeholder="Once upon a time, there lived a bunny named Harry..."
          placeholderTextColor="#ccc"
          multiline
        />
      </View>
      {/* Grammar Suggestion Panel */}
      <View style={styles.grammarPanel}>
        <Text style={styles.grammarTitle}>Review mode • 3 suggestions</Text>
        <View style={styles.grammarItem}>
          <Text style={styles.grammarLabel}>🟢 Grammar</Text>
          <Text style={styles.grammarWord}>
            <Text style={styles.strike}>possesed</Text> →{" "}
            <Text style={styles.green}>possessed</Text>
          </Text>
          <View style={styles.grammarActions}>
            <RoundedButton text="Apply" onPress={() => {}} color="#4CAF50" />
          </View>
        </View>

        <View style={styles.grammarItem}>
          <Text>
            🟣 <Text style={styles.bold}>there lived a bunny</Text> • Phrase
            suggestion
          </Text>
        </View>
        <View style={styles.grammarItem}>
          <Text>
            🟠 <Text style={styles.bold}>magical super</Text> • Repetitiveness
          </Text>
        </View>
      </View>
    </View>
  );
}
