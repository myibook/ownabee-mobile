import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.softGray,
    padding: 16,
  },
  sidebar: {
    width: '11%',
  },
  previewContainer: {
    width: 120,
    padding: 12,
    marginTop: 70,
  },
  previewContentContainer: {
    alignItems: 'center',
  },
  preview: {
    position: 'relative',
    marginBottom: 12,
  },
  previewDelete: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#f66',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  previewDeleteText: {
    color: Colors.white,
    fontSize: 12,
  },
  newPageButton: {
    width: 100,
    height: 140,
    backgroundColor: Colors.baseBlue,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  editorContainer: {
    flex: 3,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 80,
  },
  textInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lastEdit: {
    fontSize: 12,
    color: Colors.secondaryGray,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 10,
    color: Colors.tertiaryGray,
    fontWeight: 'semibold',
  },
  textInputContainer: {
    height: 1,
    backgroundColor: Colors.lightGray,
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 24,
    textAlignVertical: 'top',
  },
  aiPanel: {
    marginLeft: 16,
    borderRadius: 20,
    flex: 1,
    backgroundColor: Colors.white,
    padding: 24,
    marginTop: 80,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.primaryGray,
  },
  aiText: {
    fontSize: 14,
    color: Colors.secondaryGray,
  },
  infoIcon: {
    justifyContent: 'flex-start',
    marginTop: 90,
    alignItems: 'flex-end',
    margin: 12,
    paddingLeft: 8,
  },
});
