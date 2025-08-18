import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.softGray,
    padding: 16,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  rightButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  back: {
    fontSize: 16,
    color: Colors.primaryGray,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  editorContainer: {
    flex: 3,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 80,
  },
  textInputHeader: { flexDirection: "row", justifyContent: "space-between" },
  textInput: { flex: 1, fontSize: 24, textAlignVertical: "top" },
  aiPanel: {
    marginLeft: 16,
    borderRadius: 20,
    flex: 1,
    backgroundColor: Colors.white,
    padding: 24,
    marginTop: 80,
  },
  infoIcon: {
    justifyContent: "flex-start",
    marginTop: 90,
    alignItems: "flex-end",
    margin: 12,
    paddingLeft: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.primaryGray,
  },
  aiText: {
    fontSize: 14,
    color: Colors.secondaryGray,
  },
  sidebar: {
    width: "11%",
  },
  newPageButton: {
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  lastEdit: { fontSize: 12, color: Colors.secondaryGray, fontWeight: "bold" },
  pageInfo: {
    fontSize: 10,
    color: Colors.tertiaryGray,
    fontWeight: "semibold",
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
