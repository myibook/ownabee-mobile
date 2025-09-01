import { StyleSheet } from 'react-native';

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
  selectedThumbnail: {
    borderColor: '#007AFF',
  },
  pageNumber: {
    position: 'absolute',
    bottom: -20,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#495057',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.0,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 28,
    lineHeight: 30,
  },
});
