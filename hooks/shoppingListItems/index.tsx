import { ShoppingListItem } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchShoppingListItemsByShoppingListId = async (
  shoppingListId: string
): Promise<ShoppingListItem[]> => {
  const { data } = await supabase
    .from("shopping_list_item")
    .select("*")
    .eq("shopping_list_id", shoppingListId);
  return data as ShoppingListItem[];
};
