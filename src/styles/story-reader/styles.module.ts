import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

// Constants
const HEADER_TOP_POSITION = 40;
const HEADER_SIDE_PADDING = 20;
const NAV_BUTTON_PADDING = 12;
const PAGE_CONTAINER_MARGIN = 120;
const PAGE_GAP = 12;
const PAGE_PADDING = 24;
const PAGE_BORDER_RADIUS = 12;
const IMAGE_BORDER_RADIUS = 10;
const TEXT_LINE_HEIGHT = 20;
const SHADOW_OFFSET = { width: 0, height: 2 };
const SHADOW_RADIUS = 8;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.black,
    paddingVertical: 16,
  },

  // Header styles
  header: {
    position: 'absolute',
    top: HEADER_TOP_POSITION,
    left: HEADER_SIDE_PADDING,
    right: HEADER_SIDE_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  rightButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  back: {
    fontSize: 16,
    color: Colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },

  // Reader container styles
  readerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zoomButtonContainer: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: NAV_BUTTON_PADDING,
  },
  pageControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  // Page thumbnail styles
  sidebar: {
    width: '10%',
    zIndex: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },

  // Cover page styles
  coverPage: {
    width: 500,
    aspectRatio: 4 / 5,
    backgroundColor: Colors.mediumPurple,
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

  // Page container styles
  pageContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: PAGE_CONTAINER_MARGIN,
    gap: PAGE_GAP,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basePageLayout: {
    backgroundColor: Colors.white,
    padding: PAGE_PADDING,
    gap: PAGE_GAP,
    borderRadius: PAGE_BORDER_RADIUS,
    aspectRatio: 4 / 5,
    height: '100%',
    maxWidth: '45%',
  },
  horizontalPageLayout: {
    flexDirection: 'row',
  },
  pageRow: {
    flex: 1,
    flexDirection: 'row',
    gap: PAGE_GAP,
  },
  pageItem: {
    flex: 1,
  },

  // Image styles
  image: {
    width: '100%',
    height: '100%',
    borderRadius: IMAGE_BORDER_RADIUS,
  },

  // Text styles
  pageText: {
    color: Colors.black,
    fontSize: 14,
    lineHeight: TEXT_LINE_HEIGHT,
  },
  textContainer: {
    flex: 1,
  },
  transcript: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  word: {
    fontSize: 14,
    lineHeight: TEXT_LINE_HEIGHT,
    color: Colors.black,
    paddingHorizontal: 1,
  },
  wordPlayed: {
    color: Colors.black,
    backgroundColor: Colors.highlightBlue,
  },
  wordPending: {
    color: Colors.black,
  },
  seekbarContainer: {
    position: 'absolute',
    bottom: 68,
    zIndex: 3,
    width: '74%',
    marginHorizontal: '13%',
    marginBottom: 8,
  },
  seekbarTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seekbarTime: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: 500,
  },
});
