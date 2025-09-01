import { Colors } from '@/constants/Colors';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const numColumns = 4;
const gap = 16;
const horizontalPadding = 70 * 2;

const cardWidth = (width - horizontalPadding - gap * numColumns - 1) / numColumns;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    padding: 10,
    height: 50,
  },
  backButton: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkGray,
    fontWeight: '500',
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primaryGray,
    width: width,
    textAlign: 'center',
    marginBottom: 30,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  imageContainer: {
    padding: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    //iOS용 shadow
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    //Android용 shadow
    elevation: 4,
    padding: 20,
    marginBottom: 20,
  },
  card: {
    width: cardWidth,
    aspectRatio: 0.7,
    marginBottom: 30,
    marginTop: 30,
  },
  coverImageFull: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // 아래 정렬
  },
  overlayBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  pageBadge: {
    backgroundColor: Colors.baseBlue,
    color: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  coverImageRounded: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bookTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 2,
  },
  bookSummary: {
    fontSize: 11,
    color: Colors.black,
  },
  iconBadge: {
    backgroundColor: Colors.baseOrange,
    borderRadius: 20,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  bookType: {
    fontSize: 12,
    color: Colors.lightBlue,
    marginTop: 2,
  },
});
