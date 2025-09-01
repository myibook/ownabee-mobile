import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const THUMBNAIL_SIZE = {
  width: 100,
  height: 125, // 4:5 비율
};

export const styles = StyleSheet.create({
  container: {
    width: THUMBNAIL_SIZE.width + 40,
    alignItems: 'center',
    marginTop: 100,
    zIndex: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 3,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE.width,
    height: THUMBNAIL_SIZE.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    outlineColor: Colors.lightBlue,
    outlineWidth: 3,
  },
  pageNumber: {
    position: 'absolute',
    bottom: -20,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  coverThumbnail: {
    overflow: 'hidden',
    backgroundColor: Colors.mediumPurple,
    padding: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
});
