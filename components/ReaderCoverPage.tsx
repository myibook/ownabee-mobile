import { styles } from '@/src/styles/components/reader-cover-page/styles.module';
import { getCachedImageSource } from '@/utils/image';
import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors';

export default function ReaderCoverPage({ coverPageUrl }: { coverPageUrl?: string }) {
  return (
    <View style={styles.coverPage}>
      <Image
        source={coverPageUrl ? getCachedImageSource(coverPageUrl) : null}
        style={styles.coverImage}
        transition={250}
        contentFit="cover"
      />
      <View style={styles.swipeOverlay}>
        <MaterialIcons name="swipe" size={24} color={Colors.white} />
        <Text style={styles.swipeText}>Swipe to read</Text>
      </View>
    </View>
  );
}