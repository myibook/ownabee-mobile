import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const boxCommon = {
  borderRadius: 6,
  margin: 2,
};

export const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 140,
    padding: 6,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  vertical: {
    flex: 1,
    width: '100%',
  },
  textBox: {
    ...boxCommon,
    backgroundColor: Colors.lightGray,
    flex: 1,
    minHeight: 20,
    paddingHorizontal: 2,
    alignItems: 'center',
    paddingTop: 10,
  },
  textPreview: {
    fontSize: 4,
    color: '#6D7A88',
  },
  selectedThumbnail: {
    outlineColor: Colors.lightBlue,
    outlineWidth: 2,
  },
});