import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
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
  textInput: { flex: 1, fontSize: 24, textAlignVertical: "top" },
  sidebar: {
    width: "11%",
  },
  lastEdit: { fontSize: 10, color: Colors.fontLightGray },
  grammarPanel: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginTop: 80,
    marginLeft: 16,
    height: "75%",
  },
  grammarTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 16,
  },
  grammarItem: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
  grammarLabel: {
    fontSize: 14,
    color: Colors.primaryGray,
    marginBottom: 4,
  },
  grammarWord: {
    fontSize: 16,
    marginBottom: 8,
  },
  strike: {
    textDecorationLine: "line-through",
    color: "red",
  },
  green: {
    color: "green",
    fontWeight: "bold",
  },
  grammarActions: {
    flexDirection: "row",
    gap: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});
