import { FriendStatus, User } from "@/types";
import { useEffect, useState } from "react";
import { fetchAllFriendStatusesByUserId } from ".";

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

  return {
    friends,
    setFriends,
  };
};
