import { ShoppingListItem } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchShoppingListItemsByShoppingListId = async (
  shoppingListId: string
): Promise<ShoppingListItem[]> => {
  const { data } = await supabase
    .from("shopping_list_items")
    .select("*")
    .eq("shopping_list_id", shoppingListId);
  return data as ShoppingListItem[];
};

export const createNewShoppingListItem = async (
  shoppingListId: string,
  itemName: string
): Promise<ShoppingListItem> => {
  const { data } = await supabase
    .from("shopping_list_items")
    .insert({
      shopping_list_id: shoppingListId,
      name: itemName,
    })
    .select("*")
    .single();
  return data;
};
