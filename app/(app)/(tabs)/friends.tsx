import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import ThemedInput from "@/components/ui/ThemedInput";
import { fetchUserByEmail } from "@/hooks/profile";
import useUserStore from "@/state/userStore";
import {
  createNewFriendRequest,
  fetchAllFriendStatusesByUserId,
  FriendRequestError,
} from "@/hooks/friends";
import { FriendStatus } from "@/types";

export default function FriendsScreen() {
  const theme = useColorScheme();
  const { user } = useUserStore();
  const [friendEmail, setFriendEmail] = useState<string>("");
  const [friends, setFriends] = useState<FriendStatus[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const result = await fetchAllFriendStatusesByUserId(user.id);
        setFriends(result);
      }
    };
    fetchFriends();
  }, [user]);

  const handleAddFriend = async () => {
    const result = await fetchUserByEmail(friendEmail);
    if (!user) return;
    if (!result) {
      console.log("USER NOT FOUND!");
      return;
    }
    if (user && result.email === user.email) {
      console.log("THATS YOU, YOU DUMMY!");
      return;
    }

    try {
      await createNewFriendRequest(user.id, result.id);
    } catch (e) {
      if (e instanceof FriendRequestError) {
        console.log(e.message);
      } else {
        console.log(e);
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        {
          backgroundColor: Colors[theme ?? "light"].backgroundSecondary,
        },
      ]}
    >
      <ThemedView style={styles.container}>
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
            <Entypo
              name="plus"
              size={24}
              color={Colors[theme ?? "light"].tint}
            />
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <View style={styles.friendData}>
              <ThemedText style={styles.friendEmail}>{item.email}</ThemedText>
              {item.accepted ? (
                <Entypo
                  name="check"
                  size={24}
                  color={Colors[theme ?? "light"].tint}
                />
              ) : (
                <ThemedText type="subtitle">Pending</ThemedText>
              )}
            </View>
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 32,
    gap: 24,
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
  },
  input: {
    display: "flex",
    flex: 1,
  },
  friendData: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    marginBottom: 12,
    boxShadow: "0px 5px 05px rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  friendEmail: {
    flex: 1,
  },
});
