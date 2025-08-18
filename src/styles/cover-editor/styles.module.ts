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
  main: {
    flex: 15,
    height: "95%",
    marginLeft: 150,
    marginTop: 20,
    borderRadius: 20,
  },
  rightButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  back: {
    fontSize: 16,
    color: Colors.primaryGray,
  },
  formatList: {
    paddingTop: 20,
    alignItems: "center",
    gap: 14,
    padding: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});
