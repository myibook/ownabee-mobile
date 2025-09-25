import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const CARD_MAX_W = 700;
const CARD_MAX_H = 720; // Increased from 640 to accommodate ratio selection
const PREVIEW_H = 340; // Reduced from 380 to make room for ratio UI

export const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  card: {
    width: '92%',
    maxWidth: CARD_MAX_W,
    maxHeight: '90%', // Use percentage for better adaptability on different screen sizes
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  slide: {
    height: '100%',
  },
  slideWithBackground: {
    backgroundColor: Colors.lightGray, // Light gray background to fill empty space
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4, // Small padding to create breathing room
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    width: 18,
    backgroundColor: 'white',
  },
  previewBox: {
    height: PREVIEW_H,
    overflow: 'hidden',
    marginBottom: 8,
    borderRadius: 8,
  },
  previewPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingCover: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 8, color: Colors.black, fontWeight: '500' },
  // errorText: { color: "#d33", marginBottom: 6, fontSize: 12 },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    width: '100%',
    marginBottom: 12,
  },
  ratioSection: {
    marginBottom: 12,
  },
  ratioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  ratioButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratioButtonActive: {
    borderColor: Colors.baseBlue,
    backgroundColor: Colors.lightBlue + '20',
  },
  ratioKey: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  ratioKeyActive: {
    color: Colors.baseBlue,
  },
  promptRow: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    height: 72,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '500',
    color: Colors.black,
  },
  footer: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  optionFab: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.lightpurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: { width: 20, height: 20 },
  rightArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  buttonsArea: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  triesText: { color: Colors.silverMedium, fontSize: 15, fontWeight: '500' },
  generateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: Colors.baseBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateText: { color: '#fff', fontWeight: '500', fontSize: 15 },
});
