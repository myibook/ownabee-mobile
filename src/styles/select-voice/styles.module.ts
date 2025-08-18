import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.softGray,
  },
  header: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 26,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  rightButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  back: {
    fontSize: 16,
    color: Colors.primaryGray,
  },
});
