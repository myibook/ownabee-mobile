import TopBar from "@/components/TopBar";
import VoiceSelectGrid from "@/components/VoiceSelectGrid";
import { Colors } from "@/constants/Colors";
import { styles } from "@/src/styles/select-voice/styles.module";
import { mockVoices } from "@/mocks/voices";

import { useState } from "react";
import { View } from "react-native";

export default function VoiceSelectorScreen() {
  const [selectedVoiceId, setSelectedVoiceId] = useState<(string | null)>(null);

  return (
    <View style={styles.container}>
      <TopBar
        backHref="/cover-editor"
        title="✏️"
        rightButtons={[
          {
            text: "Preview",
            color: Colors.baseGray,
            fontColor: Colors.black,
          },
          {
            text: "Export",
            href: "/story-detail",
            color: Colors.baseBlue,
            fontColor: Colors.white,
          },
        ]}
      />
      <VoiceSelectGrid
        voices={mockVoices}
        selectedVoiceId={selectedVoiceId}
        onSelectVoice={setSelectedVoiceId}
      />
    </View>
  );
}
