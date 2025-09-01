import { styles } from '@/src/styles/components/PageThumbnailList/styles.module';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { usePages } from '../context/PageProvider';
import PagePreview from './PagePreview';

const THUMBNAIL_SIZE = {
  width: 80,
  height: 100, // 4:5 비율
};

export default function PageThumbnailList() {
  const { pages, currentPageIndex, goToPage, addPage } = usePages();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pages.map((page, index) => (
          <Pressable
            key={page.id}
            style={[
              styles.thumbnailContainer,
              currentPageIndex === index && styles.selectedThumbnail,
            ]}
            onPress={() => goToPage(index)}
          >
            <PagePreview page={page} size={THUMBNAIL_SIZE} />
            <Text style={styles.pageNumber}>{index + 1}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable style={styles.addButton} onPress={addPage}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}
