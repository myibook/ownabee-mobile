import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 3,
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.lightYellow,
  },
  contentContainer: {
    width: "100%",
    gap: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 220,
  },
  title: {
    textAlign: "center",
    fontSize: 27,
    marginBottom: 50,
  },
  buttonContainer: {
    gap: 12,
    flexDirection: "row",
  },
  bottomContainer: {
    flex: 2,
    backgroundColor: Colors.white,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.darkGray,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  signUpButton: {
    backgroundColor: Colors.lightYellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveText: {
    fontWeight: "bold",
  },
});
