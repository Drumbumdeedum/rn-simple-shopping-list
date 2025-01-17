import { Friend, User } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchAllFriendsByUserId = async (
  userId: string
): Promise<User[]> => {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
        user_id, 
        profiles!friends_friend_id_fkey (
            id, 
            updated_at, 
            email
        )
    `
    )
    .eq("user_id", userId);
  return data
    ?.map((result) => result.profiles)
    .reduce((total, current) => {
      return total.concat(current);
    }, []) as User[];
};

export const createNewFriendRequest = async (
  userId: string,
  friendId: string
): Promise<Friend> => {
  const { data, error } = await supabase
    .from("friends")
    .insert({
      user_id: userId,
      friend_id: friendId,
    })
    .select("*")
    .single();
  if (error && error?.code === "23505")
    throw new FriendRequestError("Friend request already sent");
  if (error) throw new Error(error.message);
  return data;
};

export class FriendRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FriendRequestError";
  }
}
