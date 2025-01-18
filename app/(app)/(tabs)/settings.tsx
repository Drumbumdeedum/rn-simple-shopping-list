import {
  StyleSheet,
  Image,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/context";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import useUserStore from "@/state/userStore";

export default function SettingsScreen() {
  const { signOut } = useSession();
  const { user } = useUserStore();
  const theme = useColorScheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.backgroundSecondary,
        dark: Colors.dark.backgroundSecondary,
      }}
      headerImage={
        <Entypo name="cog" size={350} color={Colors[theme ?? "light"].tint} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">{user?.email}</ThemedText>
      </ThemedView>
      <TouchableOpacity
        style={styles.logOut}
        onPress={() => {
          signOut();
        }}
      >
        <Entypo
          name="log-out"
          size={24}
          color={Colors[theme ?? "light"].tint}
        />
        <ThemedText type="link">Sign Out</ThemedText>
      </TouchableOpacity>
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
  logOut: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
  },
});
