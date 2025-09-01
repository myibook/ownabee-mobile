import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.softGray,
    paddingTop: 100,
  },
  header: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 26,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  rightButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  back: {
    fontSize: 16,
    color: Colors.primaryGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    gap: 20,
  },
  loadingText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
