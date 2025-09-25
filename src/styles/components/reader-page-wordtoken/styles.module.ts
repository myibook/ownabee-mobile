import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  word: {
    fontSize: 14,
    color: Colors.black,
    paddingHorizontal: 0.4,
  },
  wordWrap: {
    position: 'relative',
    overflow: 'hidden',
  },
  wordFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.highlightBlue,
  },
});
