import { Friend, FriendStatus, User } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchAllFriendStatusesByUserId = async (
  userId: string
): Promise<FriendStatus[]> => {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
        user_id,
        accepted, 
        profiles!friends_friend_id_fkey (
            id, 
            updated_at, 
            email
        )
    `
    )
    .eq("user_id", userId);
  if (!data) throw new Error("No data");
  return data.map((res) => {
    let user = res.profiles as unknown as User;
    return {
      id: user.id,
      email: user.email,
      accepted: res.accepted,
    };
  });
};

export const fetchFriendRequestsByUserId = async (
  userId: string
): Promise<FriendStatus[]> => {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
        user_id,
        accepted, 
        profiles!friends_user_id_fkey (
            id, 
            updated_at, 
            email
        )
    `
    )
    .eq("friend_id", userId)
    .eq("accepted", false);
  if (!data) throw new Error("No data");
  return data.map((res) => {
    let user = res.profiles as unknown as User;
    return {
      id: user.id,
      email: user.email,
      accepted: res.accepted,
    };
  });
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

export const acceptFriendRequest = async (
  userId: string,
  friendId: string
): Promise<Friend> => {
  const { data, error } = await supabase
    .from("friends")
    .update({ accepted: true })
    .eq("user_id", userId)
    .eq("friend_id", friendId)
    .select("*")
    .single();
  return data as Friend;
};

export class FriendRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FriendRequestError";
  }
}
