import { styles } from '@/src/styles/components/PagePreview/styles.module';
import { Page } from '@/types/audiobook';
import { getCachedImageSource } from '@/utils/image';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

type PagePreviewProps = {
  page: Page;
  size: { width: number; height: number };
  canvasWidth: number;
  isSelected: boolean;
};

export default function PagePreview({ page, size, isSelected, canvasWidth }: PagePreviewProps) {
  return (
    <View style={[styles.container, size, isSelected && styles.selected]}>
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
          const lineHeight = fontSize * 1.4;
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
                  lineHeight,
                  color: item.color || '#333',
                  backgroundColor: item.backgroundColor,
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
                  backgroundColor: '#CDB4DB',
                  borderRadius: 4 * (size.width / 80),
                },
              ]}
            >
              {item.imageUrl && (
                <Image
                  source={getCachedImageSource(item.imageUrl)}
                  style={{ width: '100%', height: '100%', borderRadius: 4 * (size.width / 80) }}
                  transition={250}
                  contentFit={item.aspectRatio ? 'cover' : 'fill'}
                />
              )}
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}
