import { FriendStatus, User } from "@/types";
import { useState, useEffect } from "react";
import { fetchFriendRequestsByUserId } from ".";
import { supabase } from "@/utils/initSupabase";
import { fetchUserById } from "../profile";
import { AppState, AppStateStatus } from "react-native";

export const useFriendRequests = (user: User | null) => {
  const [friendRequests, setFriendRequests] = useState<FriendStatus[]>([]);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const result = await fetchFriendRequestsByUserId(user.id);
        setFriendRequests(result);
      }
    };
    fetchFriends();
  }, [user]);

  const initializeSubscriptions = () => {
    const insertChannel = supabase
      .channel("insert_new_friend_request")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        async (payload) => {
          if (
            payload &&
            payload.new &&
            user &&
            payload.new.friend_id === user.id &&
            payload.new.accepted === false
          ) {
            const foundUser = await fetchUserById(payload.new.user_id);
            if (foundUser) {
              const friendStatus: FriendStatus = {
                id: foundUser.id,
                email: foundUser.email,
                accepted: payload.new.accepted,
              };
              setFriendRequests((prev) => [
                ...prev,
                friendStatus as FriendStatus,
              ]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      insertChannel.unsubscribe();
    };
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        initializeSubscriptions();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    initializeSubscriptions();
    return () => {
      subscription.remove();
    };
  }, [appState, friendRequests]);

  return {
    friendRequests,
    setFriendRequests,
  };
};
