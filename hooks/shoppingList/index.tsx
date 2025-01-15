import { ShoppingList, ShoppingListAccessWithListsResponse } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchShoppingListsByUserId = async (
  userId: string
): Promise<ShoppingList[]> => {
  const { data } = await supabase
    .from("shopping_lists_access")
    .select(
      `
        profile_id, 
        shopping_list_id, 
        shopping_lists ( id, created_at, creator_profile_id, name )
      `
    )
    .eq("profile_id", userId);
  const listAccessWithLists = data as ShoppingListAccessWithListsResponse[];
  return listAccessWithLists
    .map((la) => la.shopping_lists)
    .reduce((total, current) => {
      return total.concat(current);
    }, []);
};
