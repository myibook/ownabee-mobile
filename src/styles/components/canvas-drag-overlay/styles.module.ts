import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  dragOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: Colors.lightGray + 50,
    borderColor: Colors.tertiaryGray,
    borderWidth: 2,
    borderRadius: 8,
  },
});