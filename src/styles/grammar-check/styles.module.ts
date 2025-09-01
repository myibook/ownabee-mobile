import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    padding: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebarScrollView: {
    marginRight: 30,
    width: 120,
    padding: 12,
    marginTop: 70,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 80,
  },
  lastEdit: {
    fontSize: 10,
    color: Colors.fontLightGray,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: Colors.lightYellow,
    padding: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    marginLeft: 6,
  },
  editCancelButton: {
    padding: 8,
    backgroundColor: Colors.silverMedium,
    borderRadius: 5,
    marginRight: 10,
  },
  editCancelButtonText: {
    color: Colors.white,
    fontWeight: 600,
  },
  textInput: {
    flex: 1,
    fontSize: 24,
    textAlignVertical: 'top',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  fixUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: 'red',
  },
});
