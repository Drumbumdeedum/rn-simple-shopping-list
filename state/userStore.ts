import { User } from "@/types";
import { create } from "zustand";

interface UserState {
  user: User | null;
  setUser: (newUser: User) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
}));

export default useUserStore;
