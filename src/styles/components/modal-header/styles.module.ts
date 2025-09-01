import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  titleContainer: {
    paddingBottom: 24,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.black,
    fontSize: 20,
    fontWeight: '600',
  },
  subTitle: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '400',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    padding: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    padding: 8,
    borderRadius: 4,
    borderColor: Colors.lightGray,
    borderWidth: 1,
  },
});
