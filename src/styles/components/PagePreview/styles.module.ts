import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  selected: {
    outlineColor: Colors.baseBlue,
    outlineWidth: 2,
  },
});
