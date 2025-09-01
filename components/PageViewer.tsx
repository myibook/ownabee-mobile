import React from 'react';
import { View, Text, ViewStyle, Image } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { Page, CanvasTextItem, CanvasImageItem } from '@/types/audiobook';
import { ReaderPageWordToken } from './ReaderPageWordToken';

interface PageViewerProps {
  page: Page;
  size: { width: number; height: number };
  backgroundColor?: string;
  currentPositionMs?: SharedValue<number>;
  activeTextId?: string;
  onWordPress?: (wordIndex: number, transcript: any[], element: CanvasTextItem) => void;
}

const PageViewer: React.FC<PageViewerProps> = ({
  page,
  size,
  backgroundColor = '#ffffff',
  currentPositionMs = { value: 0 } as SharedValue<number>,
  activeTextId,
  onWordPress,
}) => {
  return (
    <View 
      style={[
        {
          width: size.width,
          height: size.height,
          backgroundColor,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 12,
        }
      ]}
    >
      {page.items.map(item => {
        const itemStyle = {
          position: 'absolute',
          top: item.y * size.height,
          left: item.x * size.width,
          width: item.width * size.width,
        } as ViewStyle;

        if (item.type === 'text') {
          const textItem = item as CanvasTextItem;
          const fontScale = size.width / 800;
          const fontSize = textItem.baseFontSize * (textItem.width / textItem.originalWidth) * fontScale;
          const isActiveElement = activeTextId === textItem.id;

          return (
            <View
              key={item.id}
              style={[
                itemStyle, 
                { 
                  height: textItem.height * size.height, 
                  overflow: 'hidden',
                  backgroundColor: textItem.backgroundColor || 'transparent',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }
              ]}
            >
              {textItem.transcript && textItem.transcript.map(({ word, startMs, endMs }, i) => (
                <ReaderPageWordToken
                  key={i}
                  currentPositionMs={currentPositionMs}
                  text={word}
                  startMs={startMs}
                  endMs={endMs}
                  isActiveElement={isActiveElement}
                  onPress={() => onWordPress?.(i, textItem.transcript!, textItem)}
                  baseFontSize={textItem.baseFontSize}
                  fontSize={Math.max(fontSize, textItem.minFontSize || 2)}
                  color={textItem.color || '#333'}
                  fontWeight={textItem.fontWeight || 'normal'}
                  fontStyle={textItem.fontStyle || 'normal'}
                />
              ))}
            </View>
          );
        }
        
        if (item.type === 'image') {
          const imageItem = item as CanvasImageItem;
          return (
            <View
              key={item.id}
              style={[
                itemStyle,
                {
                  height: (imageItem.width * size.width) / imageItem.aspectRatio,
                  backgroundColor: '#CDB4DB',
                  borderRadius: 4 * (size.width / 80),
                },
              ]}
            >
              {imageItem.imageUrl && (
                <Image
                  source={{ uri: imageItem.imageUrl }}
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
};

export default PageViewer;