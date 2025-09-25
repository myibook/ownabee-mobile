import { styles } from '@/src/styles/components/PageThumbnailList/styles.module';
import { Colors } from '@/constants/Colors';
import React, { useRef } from 'react';
import { Pressable, FlatList, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { usePages } from '../context/PageProvider';
import PagePreview from './PagePreview';

const THUMBNAIL_SIZE = {
  width: 80,
  height: 100, // 4:5 비율
};

export default function PageThumbnailList({canvasWidth}: {canvasWidth: number}) {
  const { pages, currentPageIndex, goToPage, addPage } = usePages();
  const listRef = useRef<FlatList>(null);

  const handleAddPage = () => {
    addPage();
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleGoToPage = (index: number) => {
    goToPage(index);
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index, animated: true });
    }, 100);
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={[...pages, { id: "add-button" }]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          if (item.id === "add-button") {
            return (
              <Pressable
                key="add-button"
                style={[styles.thumbnailContainer, styles.addButton]}
                onPress={handleAddPage}
              >
                <AntDesign name="plus" size={24} color={Colors.white} />
              </Pressable>
            );
          }

          const isSelected = currentPageIndex === index;
          return (
            <Pressable
              key={item.id}
              style={styles.thumbnailContainer}
              onPress={() => handleGoToPage(index)}
            >
              <PagePreview
                page={item}
                size={THUMBNAIL_SIZE}
                isSelected={isSelected}
                canvasWidth={canvasWidth}
              />
              <Text style={styles.pageNumber}>{index + 1}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
