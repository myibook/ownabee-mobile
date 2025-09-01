import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/components/page-thumbnail/styles.module';
import { PageThumbnailProps } from '@/types/audiobook';
import React from 'react';
import { Text, View } from 'react-native';

export default function PageThumbnail({ content, isSelected, onPress }: PageThumbnailProps) {
  const { originalText: text } = content;
  return (
    <View
      onTouchEnd={onPress}
      style={[styles.container, isSelected && { borderColor: Colors.lightBlue, borderWidth: 2 }]}
    >
      <View style={styles.vertical}>
        <View style={styles.textBox}>
          <Text style={styles.textPreview}>{text?.slice(0, 500)}</Text>
        </View>
      </View>
    </View>
  );
}