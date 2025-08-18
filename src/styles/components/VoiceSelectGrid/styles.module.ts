import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    maxWidth: 1000,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "auto",
    paddingHorizontal: 150,
    paddingVertical: 100,
    gap: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  voiceImage: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  createVoiceButton: {
    backgroundColor: Colors.baseBlue,
  },
  voiceName: {
    color: Colors.black,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  selectedVoiceImage: {
    borderWidth: 5,
    borderColor: Colors.baseBlue,
  },
  selectedVoiceName: {
    backgroundColor: Colors.baseBlue,
    color: Colors.white,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});