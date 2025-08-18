import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightYellow,
    padding: 24,
    paddingTop: 80,
    paddingBottom: 80,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    marginTop: 60,
  },
  text: {
    fontSize: 55,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 75,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingHorizontal: 30,
  },
});
