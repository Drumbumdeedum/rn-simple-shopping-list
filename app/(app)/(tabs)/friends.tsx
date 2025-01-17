import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import ThemedInput from "@/components/ui/ThemedInput";
import { fetchUserByEmail } from "@/hooks/profile";
import useUserStore from "@/state/userStore";

export default function FriendsScreen() {
  const theme = useColorScheme();
  const { user } = useUserStore();
  const [friendEmail, setFriendEmail] = useState<string>("");

  const handleAddFriend = async () => {
    const result = await fetchUserByEmail(friendEmail);
    console.log("REQUESTED: ", result);
    console.log("LOGGED IN: ", user);
    if (user && result.email === user.email) {
      console.log("THATS YOU, YOU DUMMY");
    }
  };

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

      <ThemedView style={styles.inputContainer}>
        <ThemedInput
          placeholder="Email address"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.nativeEvent.text)}
        />
        <TouchableOpacity onPress={handleAddFriend}>
          <Entypo name="plus" size={24} color={Colors[theme ?? "light"].tint} />
        </TouchableOpacity>
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
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  input: {
    display: "flex",
    flex: 1,
  },
});
