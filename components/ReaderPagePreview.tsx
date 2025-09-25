import { styles } from '@/src/styles/components/ReaderPagePreview/styles.module';
import { Page } from '@/types/audiobook';
import { getCachedImageSource } from '@/utils/image';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

type PagePreviewProps = {
  page: Page;
  size: { width: number; height: number };
  canvasWidth: number;
};

export default function PagePreview({ page, size, canvasWidth }: PagePreviewProps) {
  return (
    <View style={[styles.container, size]}>
      {page.items.map(item => {
        const itemStyle = {
          position: 'absolute',
          top: item.y * size.height,
          left: item.x * size.width,
          width: item.width * size.width,
        } as ViewStyle;

        if (item.type === 'text') {
          const fontScale = size.width / canvasWidth;
          const fontSize = item.baseFontSize * fontScale;
          return (
            <View
              key={item.id}
              style={[itemStyle, { height: 'auto', overflow: 'hidden' }]}
            >
              <Text
                style={{
                  fontSize: Math.max(fontSize, 2),
                  fontStyle: item.fontStyle,
                  fontWeight: item.fontWeight,
                  color: '#333',
                }}
                ellipsizeMode="clip"
              >
                {item.content}
              </Text>
            </View>
          );
        }
        if (item.type === 'image') {
          return (
            <View
              key={item.id}
              style={[
                itemStyle,
                {
                  height: item.aspectRatio
                    ? (item.width * size.width) / item.aspectRatio
                    : item.height! * size.height,
                  borderRadius: 4 * (size.width / 80),
                },
              ]}
            >
              <Image
                source={item.imageUrl ? getCachedImageSource(item.imageUrl) : null}
                style={styles.image}
                transition={250}
                contentFit={item.aspectRatio ? 'cover' : 'fill'}
              />
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}
