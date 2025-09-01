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
  noBottomPadding: {
    paddingBottom: 0,
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    width: 800,
    gap: 20,
  },
  loadingText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
