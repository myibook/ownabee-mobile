import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 700,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.tertiaryGray,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadContainer: {
    flex: 1,
    borderRadius: 8,
    gap: 12,
    backgroundColor: Colors.quaternaryGray,
    borderStyle: 'dashed',
    borderColor: Colors.tertiaryGray,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: Colors.primaryGray,
    fontWeight: '500',
  },
  selectedFilesContainer: {
    gap: 8,
  },
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderColor: Colors.tertiaryGray,
    borderWidth: 1,
    borderRadius: 6,
  },
  fileInfoContainer: {
    gap: 4,
  },
  fileName: {
    color: Colors.black,
    fontWeight: '500',
    maxWidth: 300,
  },
  fileMetadata: {
    color: Colors.primaryGray,
    fontWeight: '400',
  },
  iconButtonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  createButtonContainer: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: Colors.darkGray,
    fontSize: 16,
    fontWeight: '600',
  },
});
