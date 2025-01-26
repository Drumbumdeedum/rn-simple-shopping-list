import { ShoppingListItem } from "@/types";
import { supabase } from "@/utils/initSupabase";
import { useEffect, useState } from "react";
import { fetchShoppingListItemsByShoppingListId } from ".";
import { AppState, AppStateStatus } from "react-native";
import { deepEqual } from "@/utils";

const useShoppingListItems = (shoppingListId: string) => {
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  const fetchItems = async () => {
    const items = await fetchShoppingListItemsByShoppingListId(
      shoppingListId as string
    );
    setListItems(items);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const initializeSubscriptions = () => {
    const insertChannel = supabase
      .channel("insert_new_shopping_list_item")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shopping_list_items" },
        (payload) => {
          if (payload.new?.shopping_list_id === shoppingListId) {
            setListItems((prev) => {
              const exists = prev.some((item) => item.id === payload.new.id);
              return exists ? prev : [...prev, payload.new as ShoppingListItem];
            });
          }
        }
      )
      .subscribe();

    const updateChannel = supabase
      .channel("update_shopping_list_item")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "shopping_list_items" },
        (payload) => {
          if (payload.new?.shopping_list_id === shoppingListId) {
            setListItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id
                  ? (payload.new as ShoppingListItem)
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      insertChannel.unsubscribe();
      updateChannel.unsubscribe();
    };
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        initializeSubscriptions();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    initializeSubscriptions();
    fetchItems();
    return () => {
      subscription.remove();
    };
  }, [shoppingListId, appState]);

  return {
    listItems,
    setListItems,
  };
};

export default useShoppingListItems;
