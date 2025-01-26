import { ShoppingListItem } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchShoppingListItemsByShoppingListId = async (
  shoppingListId: string
): Promise<ShoppingListItem[]> => {
  const { data } = await supabase
    .from("shopping_list_items")
    .select("*")
    //.order("checked", { ascending: true })
    .eq("shopping_list_id", shoppingListId);
  return data as ShoppingListItem[];
};

export const createNewShoppingListItem = async (
  shoppingListId: string,
  itemName: string
): Promise<ShoppingListItem> => {
  const { data, error } = await supabase
    .from("shopping_list_items")
    .insert({
      shopping_list_id: shoppingListId,
      name: itemName,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateShoppingListItemChecked = async (
  id: string,
  checked: boolean
): Promise<ShoppingListItem> => {
  const { data, error } = await supabase
    .from("shopping_list_items")
    .update({
      checked: checked,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteShoppingListItem = async (id: string) => {
  await supabase.from("shopping_list_items").delete().eq("id", id);
};
