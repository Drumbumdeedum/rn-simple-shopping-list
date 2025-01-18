import { FriendStatus, User } from "@/types";
import { useState, useEffect } from "react";
import { fetchFriendRequestsByUserId } from ".";
import { supabase } from "@/utils/initSupabase";
import { fetchUserById } from "../profile";

export const useFriendRequests = (user: User | null) => {
  const [friendRequests, setFriendRequests] = useState<FriendStatus[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (user) {
        const result = await fetchFriendRequestsByUserId(user.id);
        setFriendRequests(result);
      }
    };
    fetchFriends();
  }, [user]);

  useEffect(() => {
    const channel = supabase
      .channel("insert_new_friend_request")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        async (payload) => {
          console.log(payload);
          if (
            payload &&
            payload.new &&
            user &&
            payload.new.friend_id === user.id
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
      channel.unsubscribe();
    };
  }, []);

  return {
    friendRequests,
    setFriendRequests,
  };
};
