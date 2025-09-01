import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.softGray,
    paddingHorizontal: 44,
    paddingTop: 50,
  },
  header: {
    marginBottom: 16,
  },
  back: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  content: {
    flexDirection: 'row',
    height: '80%',
    marginTop: 20,
    //iOS shadow
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    //Android shadow
    elevation: 4,
  },
  coverWrapper: {
    flex: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.black,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 2,
    borderColor: Colors.black,
  },
  cover: {
    width: '60%',
    height: '80%',
    borderRadius: 15,
  },
  pageCount: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.baseGray,
  },
  infoPanel: {
    flex: 1,
    padding: 70,
    borderWidth: 2,
    borderRightColor: Colors.lightGray,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  label: {
    color: Colors.silverMedium,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryGray,
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 8,
  },
});
