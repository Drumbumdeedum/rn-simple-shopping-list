import { ShoppingListItem } from "@/types";
import { supabase } from "@/utils/initSupabase";
import { useEffect, useState } from "react";
import { fetchShoppingListItemsByShoppingListId } from ".";

const useShoppingListItems = (id: string) => {
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchShoppingListItemsByShoppingListId(id as string);
      setListItems(items);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("insert_new_shopping_list_item")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shopping_list_items" },
        (payload) => {
          if (payload && payload.new && payload.new.shopping_list_id === id) {
            setListItems((prev) => [...prev, payload.new as ShoppingListItem]);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("update_shopping_list_item")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "shopping_list_items" },
        (payload) => {
          if (payload && payload.new && payload.new.shopping_list_id === id) {
            setListItems((prev) =>
              prev
                .map((item) => {
                  return item.id === payload.new.id
                    ? (payload.new as ShoppingListItem)
                    : item;
                })
                .sort((a, b) => {
                  if (a.checked === b.checked) return 0;
                  return a.checked ? 1 : -1;
                })
            );
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return {
    listItems,
    setListItems,
  };
};

export default useShoppingListItems;
