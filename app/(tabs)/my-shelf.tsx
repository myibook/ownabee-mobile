import { Colors } from "@/constants/Colors";
import { fetchAudioBooks } from "@/services/service";
import { styles } from "@/src/styles/my-shelf/styles.module";
import { AudioBook } from "@/types/audiobook";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";

export default function LibraryScreen() {
  const [audioBooks, setAudioBooks] = useState<AudioBook[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      const result = await fetchAudioBooks();
      setAudioBooks(result);
    };
    loadBooks();
  }, []);

  const renderBookCard = ({ item }: { item: AudioBook }) => {
    return (
      <Link
        href={{
          pathname: "/story-detail",
          params: { id: item.id },
        }}
        style={styles.card}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <View style={styles.cardContainer}>
            <ImageBackground
              source={
                item.cover
                  ? { uri: item.cover }
                  : require("../../assets/images/zombie.png")
              }
              style={styles.coverImageFull}
              imageStyle={styles.coverImageRounded}
            >
              <View style={styles.overlayBottom}>
                <Text style={styles.pageBadge}>6 pages</Text>
                <View style={styles.iconBadge}>
                  <Feather name="edit-3" size={14} color={Colors.white} />
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              paddingLeft: 20,
            }}
          >
            <Text numberOfLines={1} style={styles.bookTitle}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={styles.bookSummary}>
              test summary
            </Text>
            <Text style={styles.bookType}>Picture Book</Text>
          </View>
        </View>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{}}>
          <Link href="/(tabs)" style={styles.backButton}>
            ← Back
          </Link>
        </View>
        <View style={styles.userInfo}></View>
      </View>

      <ImageBackground
        source={require("../../assets/images/libraryBackground.png")}
        style={styles.imageContainer}
        resizeMode="none"
      >
        <View>
          <Text style={styles.title}>Library</Text>
        </View>
        <FlatList
          data={audioBooks}
          renderItem={renderBookCard}
          keyExtractor={(item) => item.id}
          numColumns={4}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
}
