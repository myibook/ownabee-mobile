import RoundedButton from "@/components/RoundedButton";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/auth";
import { styles } from "@/src/styles/eLibrary/styles.module";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import StoryTitleModal from "../story-title-modal";

export default function ELibraryScreen() {
  const [isTitleModalVisible, setIsTitleModalVisible] =
    useState<boolean>(false);
  const { signOut, user } = useAuth();

  const onTitleModalClose = () => {
    setIsTitleModalVisible(false);
  };

  const onTitleModalOpen = () => {
    setIsTitleModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={{ color: Colors.white }}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTitleModalOpen} style={styles.createStory}>
          <Text style={styles.createStoryText}>Create story</Text>
        </TouchableOpacity>
        <RoundedButton
          text="cover editor"
          href="/cover-editor"
          color={Colors.backgroundPurple}
          fontColor={Colors.black}
        />
        <View style={{ marginLeft: 10 }}>
          <Image source={{ uri: user?.picture }} style={styles.picture} />
        </View>
        <StoryTitleModal
          isVisible={isTitleModalVisible}
          onClose={onTitleModalClose}
        />
      </View>
      <Text>email : {user?.email}</Text>
    </View>
  );
}
