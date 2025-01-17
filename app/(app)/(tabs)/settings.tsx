import { StyleSheet, Image, Platform, useColorScheme } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/context";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function TabTwoScreen() {
  const { signOut } = useSession();
  const theme = useColorScheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Entypo name="cog" size={350} color={Colors[theme ?? "light"].tint} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedText
        type="link"
        onPress={() => {
          signOut();
        }}
      >
        Sign Out
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
