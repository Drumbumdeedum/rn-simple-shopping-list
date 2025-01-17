import { Friend } from "@/types";
import { supabase } from "@/utils/initSupabase";

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
