import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    maxHeight: "90%",
    maxWidth: "80%",
    overflow: "hidden",
  },
  titleContainer: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "600",
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.darkGray,
  },
});
