import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const boxCommon = {
  borderRadius: 8,
  margin: 2,
};

export const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 140,
    padding: 6,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  vertical: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  horizontalLayout: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  gridLayout: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
  gridRow: {
    flexDirection: "row",
    flex: 1,
  },
  imageBoxSmall: {
    flex: 1,
    backgroundColor: Colors.softPurple,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    margin: 1,
  },
  textBoxSmall: {
    flex: 1,
    backgroundColor: Colors.baseGray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    margin: 1,
  },
  image: {
    ...boxCommon,
    backgroundColor: Colors.softPurple,
    flex: 1,
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    ...boxCommon,
    backgroundColor: Colors.baseGray,
    flex: 1,
    minHeight: 20,
    paddingHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textPreview: {
    fontSize: 8,
    color: "#6D7A88",
    textAlign: "center",
  },
});
