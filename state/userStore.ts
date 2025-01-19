import { FriendStatus, User } from "@/types";
import { create } from "zustand";

interface UserState {
  user: User | null;
  setUser: (newUser: User | null) => void;
  friends: FriendStatus[];
  setFriends: (newFriends: FriendStatus[]) => void;
  addFriend: (newFriend: FriendStatus) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
  friends: [],
  setFriends: (newFriends) => set(() => ({ friends: newFriends })),
  addFriend: (newFriend) =>
    set((state) => ({ friends: [...state.friends, newFriend] })),
}));

export default useUserStore;
