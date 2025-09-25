import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const THUMBNAIL_SIZE = {
  width: 80,
  height: 100, // 4:5 비율
};

export const styles = StyleSheet.create({
  container: {
    width: 120,
    alignItems: 'center',
    marginTop: 25,
  },
  scrollContent: {
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE.width + 4,
    height: THUMBNAIL_SIZE.height + 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 30,
    position: 'relative',
  },
  pageNumber: {
    position: 'absolute',
    bottom: -20,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  addButton: {
    width: THUMBNAIL_SIZE.width,
    height: THUMBNAIL_SIZE.height,
    backgroundColor: Colors.baseBlue,
  },
});
