import { FriendStatus, User } from "@/types";
import { useEffect, useState } from "react";
import { fetchAllFriendStatusesByUserId } from ".";
import { createNewFriendRequest, FriendRequestError } from ".";
import { fetchUserByEmail } from "../profile";
import { supabase } from "@/utils/initSupabase";

export const useFriends = (user: User | null) => {
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

  const handleAddFriend = async (friendEmail: string) => {
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
    if (friends.find((request) => request.email === friendEmail)) {
      console.log("ALREADY EXISTS AS AN INCOMING REQUEST");
      return;
    }

    try {
      const fr = await createNewFriendRequest(user.id, result.id);
      const frs: FriendStatus = {
        id: fr.friend_id,
        email: friendEmail,
        accepted: fr.accepted,
      };
      setFriends((prev) => [...prev, frs]);
    } catch (e) {
      if (e instanceof FriendRequestError) {
        console.log(e.message);
      } else {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel("update_friend_request_accepted")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "friends" },
          async (payload) => {
            if (
              payload &&
              payload.new &&
              user &&
              payload.new.user_id === user.id &&
              payload.new.accepted === true
            ) {
              setFriends((prev) =>
                prev.map((fr) =>
                  fr.id === payload.new.friend_id
                    ? { ...fr, accepted: true }
                    : fr
                )
              );
            }
          }
        )
        .subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, friends]);

  return {
    friends,
    setFriends,
    handleAddFriend,
  };
};
