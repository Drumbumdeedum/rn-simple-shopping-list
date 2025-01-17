import { FriendStatus, User } from "@/types";
import { useState, useEffect } from "react";
import { fetchFriendRequestsByUserId } from ".";

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

  return {
    friendRequests,
    setFriendRequests,
  };
};
