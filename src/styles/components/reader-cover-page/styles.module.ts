import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const PAGE_BORDER_RADIUS = 12;
const SHADOW_OFFSET = { width: 0, height: 2 };
const SHADOW_RADIUS = 8;

export const styles = StyleSheet.create({
  coverPage: {
    width: 500,
    aspectRatio: 4 / 5,
    borderRadius: PAGE_BORDER_RADIUS,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  swipeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    textShadowColor: Colors.black,
    textShadowOffset: SHADOW_OFFSET,
    textShadowRadius: SHADOW_RADIUS,
    /// iOS shadow
    shadowColor: Colors.black,
    shadowOffset: SHADOW_OFFSET,
    shadowRadius: SHADOW_RADIUS,
    shadowOpacity: 1,
    elevation: 5,
  },
  swipeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
