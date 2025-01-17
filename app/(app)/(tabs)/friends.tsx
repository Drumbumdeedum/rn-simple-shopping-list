import { StyleSheet, useColorScheme } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function FriendsScreen() {
  const theme = useColorScheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.backgroundSecondary,
        dark: Colors.dark.backgroundSecondary,
      }}
      headerImage={
        <Entypo name="users" size={250} color={Colors[theme ?? "light"].tint} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Friends</ThemedText>
      </ThemedView>
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
