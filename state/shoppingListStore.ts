import { ShoppingList } from "@/types";
import { create } from "zustand";

interface ShoppingListState {
  shoppingLists: ShoppingList[];
  setShoppingLists: (newList: ShoppingList[]) => void;
}

const useShoppingListStore = create<ShoppingListState>((set) => ({
  shoppingLists: [],
  setShoppingLists: (newList) => set(() => ({ shoppingLists: newList })),
}));

export default useShoppingListStore;
