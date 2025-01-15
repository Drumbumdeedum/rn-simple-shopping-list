import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useUserStore from "@/state/userStore";
import ThemedInput from "@/components/ui/ThemedInput";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, setUser } = useUserStore();
  const theme = useColorScheme();

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <ThemedView style={styles.header}>
        <ThemedInput placeholder="List name" />
        <TouchableOpacity>
          <IconSymbol
            size={32}
            name="plus.circle"
            color={theme === "light" ? Colors.light.text : Colors.dark.text}
          />
        </TouchableOpacity>
      </ThemedView>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 18,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
