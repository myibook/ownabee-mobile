import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    paddingBottom: 50,
    backgroundColor: Colors.baseBackgroundColor,
  },
  header: {
    marginTop: 15,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 32,
  },
  genreList: {
    alignItems: 'center',
    gap: 16,
  },
  genreButton: {
    width: '30%',
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
  },
  genreSelected: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  genreText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  genreTextSelected: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingHorizontal: 8,
  },
});
