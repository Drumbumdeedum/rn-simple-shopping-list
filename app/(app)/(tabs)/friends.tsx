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
import React, { useState } from "react";
import ThemedInput from "@/components/ui/ThemedInput";
import useUserStore from "@/state/userStore";
import { acceptFriendRequest } from "@/hooks/friends";
import { useFriends } from "@/hooks/friends/useFriends";
import { useFriendRequests } from "@/hooks/friends/useFriendRequests";

export default function FriendsScreen() {
  const theme = useColorScheme();
  const { user } = useUserStore();
  const [friendEmail, setFriendEmail] = useState<string>("");
  const { friends, setFriends, handleAddFriend } = useFriends(user);
  const { friendRequests, setFriendRequests } = useFriendRequests(user);

  const addFriend = () => {
    handleAddFriend(friendEmail);
    setFriendEmail("");
  };

  const handleAccept = async (userId: string) => {
    if (user) {
      const result = await acceptFriendRequest(userId, user.id);
      const updated = friendRequests.find((fr) => fr.id === result.user_id);
      if (updated) {
        updated.accepted = true;
        setFriends((prev) => [...prev, updated]);
        setFriendRequests((prev) =>
          prev.filter((fr) => fr.id !== result.user_id)
        );
      }
    }
  };
  const handleDecline = (userId: string) => {
    console.log("DECLINE");
    console.log(userId);
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
          <ThemedText type="title">Add new friend</ThemedText>
        </ThemedView>

        <ThemedView style={styles.inputContainer}>
          <ThemedInput
            placeholder="Email address"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.nativeEvent.text)}
          />
          <TouchableOpacity onPress={addFriend}>
            <Entypo
              name="add-user"
              size={24}
              color={Colors[theme ?? "light"].tint}
            />
          </TouchableOpacity>
        </ThemedView>

        {friendRequests.length > 0 && (
          <>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Friend requests</ThemedText>
            </ThemedView>
            <FlatList
              data={friendRequests}
              renderItem={({ item }) => (
                <View style={styles.friendRequestData}>
                  <ThemedText style={styles.friendEmail}>
                    {item.email}
                  </ThemedText>
                  <View style={styles.requestButtonContainer}>
                    <TouchableOpacity
                      style={[styles.requestButton, styles.accept]}
                      onPress={() => handleAccept(item.id)}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.requestText}
                      >
                        Accept
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.requestButton, styles.decline]}
                      onPress={() => handleDecline(item.id)}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.requestText}
                      >
                        Decline
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </>
        )}
        {friends.length > 0 && (
          <>
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">Friends</ThemedText>
            </ThemedView>
            <FlatList
              data={friends}
              renderItem={({ item }) => (
                <View style={styles.friendData}>
                  <ThemedText style={styles.friendEmail}>
                    {item.email}
                  </ThemedText>
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
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 32,
    gap: 12,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  input: {
    display: "flex",
    flex: 1,
  },
  friendRequestData: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    borderRadius: 8,
    padding: 16,
    boxShadow: "0px 5px 05px rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  requestButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  requestButton: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 3,
    boxShadow: "0px 5px 05px rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  requestText: {
    color: "#fff",
  },
  accept: {
    backgroundColor: "green",
  },
  decline: {
    backgroundColor: "red",
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
