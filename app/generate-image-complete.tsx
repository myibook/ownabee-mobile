import RoundedButton from '@/components/RoundedButton';
import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/generate-image-complete/styles.module';
import React from 'react';
import { Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function GenerateImageCompleteScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Hooray! You are so close to{'\n'}
          finishing your book.{'\n'}Now let’s generate a cover to finalize.
        </Text>
      </View>
      <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut fallSpeed={3000} />
      <View style={styles.footer}>
        <RoundedButton text="Back" href="/image-format" color={Colors.softPink} />
        <RoundedButton
          text="Generate Cover"
          href="/cover-editor"
          color={Colors.white}
          fontColor={Colors.black}
        />
      </View>
    </View>
  );
}
