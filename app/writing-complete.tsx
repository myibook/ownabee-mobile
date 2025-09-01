import RoundedButton from '@/components/RoundedButton';
import { Colors } from '@/constants/Colors';
import { styles } from '@/src/styles/writing-complete/styles.module';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function WritingCompleteScreen() {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleGrammarCheckStart = async () => {
      try {
      setIsLoading(true);
      router.push({ pathname: '/grammar-check' });
      } catch (error) {
      console.error('❌ 저장 실패 handleStart', error);
      } finally {
      setIsLoading(false);
      }
    };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Great job! You've finishing writing {'\n'}your story. Now, let's move on to{'\n'}reviewing
          your grammar.
        </Text>
      </View>
      <ConfettiCannon count={100} origin={{ x: 200, y: 0 }} fadeOut fallSpeed={3000} />
      <View style={styles.footer}>
        <RoundedButton
          text="Back"
          href="/story-editor"
          color={Colors.lightYellow}
          fontColor={Colors.black}
        />
        <RoundedButton
          text="Review Grammar"
          color={Colors.white}
          fontColor={Colors.black}
          isSaving={isLoading}
          onPress={handleGrammarCheckStart}
        />
      </View>
    </View>
  );
}
