import { Colors } from "@/constants/Colors";
import { Voice } from "@/types/voice";

export const mockVoices: Voice[] = [
  { id: "1", name: "mom's voice", placeholderColor: Colors.lightYellow },
  { id: "2", name: "dad's voice", placeholderColor: Colors.purple },
  { id: "3", name: "mary's voice", placeholderColor: Colors.baseYellow },
  { id: "4", name: "tim's voice", placeholderColor: Colors.backgroundPurple },
  { id: "5", name: "suzy's voice", placeholderColor: Colors.baseBlue },
  { id: "6", name: "paul's voice", placeholderColor: Colors.baseOrange },
  { id: "7", name: "anna's voice", placeholderColor: Colors.silverMedium },
  { id: "8", name: "john's voice", placeholderColor: Colors.lightBlue },
  { id: "9", name: "lisa's voice", placeholderColor: Colors.mediumPurple },
  { id: "10", name: "mike's voice", placeholderColor: Colors.softPink },
  { id: "11", name: "sara's voice", placeholderColor: Colors.softPurple },
  { id: "12", name: "Annie", image: require("../assets/images/voices/annie.png"), },
  { id: "13", name: "Tina", image: require("../assets/images/voices/tina.png") },
  { id: "14", name: "Casey", image: require("../assets/images/voices/casey.png") },
  { id: "15", name: "Ahmed", image: require("../assets/images/voices/ahmed.png") },
];