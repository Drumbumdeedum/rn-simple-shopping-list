import { create } from "zustand";

interface UserState {
  user: any;
  setUser: (newUser: any) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
}));

export default useUserStore;
