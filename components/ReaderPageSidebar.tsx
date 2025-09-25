import ReaderPagePreview from '@/components/ReaderPagePreview';
import { styles } from '@/src/styles/components/reader-page-sidebar/styles.module';
import { Page } from '@/types/audiobook';
import { Colors } from '@/constants/Colors';
import { getCachedImageSource } from '@/utils/image';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  pages: Page[];
  canvasWidth: number;
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
      <Image
        source={getCachedImageSource(imageSource)}
        style={styles.coverImage}
        transition={250}
        contentFit="cover"
      />
    </View>
  );
}

function SidebarInner({ pages, canvasWidth, selectedIndex, onPressIndex, imageSource }: Props) {
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
            <ReaderPagePreview
              page={page}
              size={THUMBNAIL_SIZE}
              canvasWidth={canvasWidth}
            />
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
