import { styles } from '@/src/styles/components/PagePreview/styles.module';
import { Page } from '@/types/audiobook';
import React from 'react';
import { Image, Text, View, ViewStyle } from 'react-native';

type PagePreviewProps = {
  page: Page;
  size: { width: number; height: number };
};

export default function PagePreview({ page, size }: PagePreviewProps) {
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
          const fontScale = size.width / 800;
          const fontSize = item.baseFontSize * (item.width / item.originalWidth) * fontScale;
          return (
            <View
              key={item.id}
              style={[itemStyle, { height: item.height * size.height, overflow: 'hidden' }]}
            >
              <Text
                style={{
                  fontSize: Math.max(fontSize, 2),
                  color: item.color || '#333',
                  backgroundColor: item.backgroundColor,
                }}
                numberOfLines={10}
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
                  height: (item.width * size.width) / item.aspectRatio,
                  backgroundColor: '#CDB4DB',
                  borderRadius: 4 * (size.width / 80),
                },
              ]}
            >
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: '100%', height: '100%', borderRadius: 4 * (size.width / 80) }}
                  resizeMode="cover"
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
