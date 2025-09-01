import { Colors } from '@/constants/Colors';
import { StyleSheet, ViewStyle } from 'react-native';

const badgeCommon = {
  position: 'absolute',
  top: -4,
  right: -4,
  paddingHorizontal: 4,
  paddingVertical: 3,
  borderRadius: 4,
  color: Colors.white,
  outlineColor: Colors.white,
  outlineWidth: 2,
} as ViewStyle;

export const styles = StyleSheet.create({
  scrollContainer: {
    maxWidth: 800,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 100,
    gap: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContainer: {
    paddingVertical: 40,
  },
  voiceContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  voiceImage: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  createVoiceButton: {
    backgroundColor: Colors.baseBlue,
    borderBottomWidth: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  voiceName: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    maxWidth: 130,
  },
  selectedVoiceImage: {
    filter: 'brightness(0.8)',
  },
  selectedVoiceName: {
    backgroundColor: Colors.baseBlue,
    color: Colors.white,
  },
  selectedVoiceIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  readyVoiceBadge: {
    ...badgeCommon,
    backgroundColor: Colors.baseBlue,
  },
  newVoiceBadge: {
    ...badgeCommon,
    backgroundColor: Colors.baseOrange,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
