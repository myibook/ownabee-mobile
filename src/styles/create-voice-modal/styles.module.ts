import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 40,
    maxHeight: '70%',
    maxWidth: '70%',
    overflow: 'hidden',
  },
});
