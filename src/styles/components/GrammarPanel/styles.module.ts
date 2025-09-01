import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderRadius: 20,
    padding: 24,
    marginTop: 60,
    width: 350,
  },
  panel: {
    flex: 1,
    borderRadius: 20,
  },
  navContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 50,
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  navButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  original: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'red',
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  message: {
    marginTop: 12,
    color: Colors.fontLightGray,
    fontSize: 16,
    fontWeight: '600',
  },

  fixItem: {
    backgroundColor: '#FFFFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  corrected: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggested: {
    fontSize: 16,
    color: Colors.lightBlue,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  explanation: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  applyButton: {
    width: 70,
    height: 30,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  applyButtonText: {
    color: Colors.white,
    fontWeight: 700,
  },
  suggestApplyButton: {
    width: 70,
    height: 30,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  contentScrollView: {
    flex: 1,
  },
});
