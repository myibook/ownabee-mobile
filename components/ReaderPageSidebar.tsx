import React from 'react';
import { Pressable, ScrollView, View, Text } from 'react-native';
import ReaderPagePreview from '@/components/ReaderPagePreview';
import { Image as ExpoImage } from 'expo-image';
import { styles } from '@/src/styles/components/reader-page-sidebar/styles.module';
import { Page } from '@/types/audiobook';
import { Colors } from '@/constants/Colors';

type Props = {
  pages: Page[];
  selectedIndex: 'cover' | number | null;
  onPressIndex: (i: 'cover' | number) => void;
  imageSource: any;
};

const THUMBNAIL_SIZE = {
  width: 100,
  height: 125, // 4:5 비율
};

function CoverThumbnail({
  isSelected,
  onPress,
  imageSource,
}: {
  isSelected: boolean;
  onPress: () => void;
  imageSource: any;
}) {
  return (
    <View
      onTouchEnd={onPress}
      style={[
        styles.thumbnailContainer,
        styles.coverThumbnail,
        isSelected && { outlineColor: Colors.lightBlue, outlineWidth: 3 },
      ]}
    >
      <ExpoImage
        source={imageSource}
        style={styles.coverImage}
        contentFit="cover"
        transition={0}
        recyclingKey="cover"
        cachePolicy="memory-disk"
      />
    </View>
  );
}

function SidebarInner({ pages, selectedIndex, onPressIndex, imageSource }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CoverThumbnail
          isSelected={selectedIndex === 'cover'}
          onPress={() => onPressIndex('cover')}
          imageSource={imageSource}
        />
        {pages.map((page, index) => (
          <Pressable
            key={page.id}
            style={[
              styles.thumbnailContainer,
              selectedIndex === index && styles.selectedThumbnail,
            ]}
            onPress={() => onPressIndex(index)}
          >
            <ReaderPagePreview page={page} size={THUMBNAIL_SIZE} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default React.memo(
  SidebarInner,
  (prev, next) => prev.selectedIndex === next.selectedIndex && prev.pages === next.pages // mockBook.pages 참조가 고정이면 OK
);
