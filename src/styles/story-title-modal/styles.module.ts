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
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  modalContent: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.tertiaryGray,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 12,
    width: 60,
    height: 35,
    backgroundColor: Colors.tertiaryGray,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 60,
    height: 35,
    position: 'relative',
    backgroundColor: Colors.baseBlue,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
