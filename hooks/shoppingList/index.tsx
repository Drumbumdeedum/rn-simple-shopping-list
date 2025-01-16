import { ShoppingList, ShoppingListAccessWithListsResponse } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchShoppingListsByUserId = async (
  userId: string
): Promise<ShoppingList[]> => {
  const { data } = await supabase
    .from("shopping_lists_access")
    .select(
      `
        user_id, 
        shopping_list_id, 
        shopping_lists ( id, created_at, user_id, name )
      `
    )
    .eq("user_id", userId);
  const listAccessWithLists = data as ShoppingListAccessWithListsResponse[];
  return listAccessWithLists
    .map((la) => la.shopping_lists)
    .reduce((total, current) => {
      return total.concat(current);
    }, []);
};

export const createNewShoppingList = async (
  userId: string,
  listName: string
): Promise<ShoppingList> => {
  const { data } = await supabase
    .from("shopping_lists")
    .insert({
      user_id: userId,
      name: listName,
    })
    .select("*")
    .single();
  return data as ShoppingList;
};
