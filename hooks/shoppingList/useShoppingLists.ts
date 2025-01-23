import useUserStore from "@/state/userStore";
import { ShoppingList, User } from "@/types";
import { useState, useEffect } from "react";
import { fetchShoppingListsByUserId } from ".";
import { AppState, AppStateStatus } from "react-native";
import { supabase } from "@/utils/initSupabase";

const useShoppingLists = () => {
  const { user } = useUserStore();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  const fetchShoppingLists = async () => {
    if (user) {
      const resultLists = await fetchShoppingListsByUserId(user.id);
      setShoppingLists(resultLists);
    }
  };

  const initializeSubscriptions = (currentUser: User) => {
    const insertChannel = supabase
      .channel("insert_new_list_access")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "shopping_lists_access" },
        async (payload) => {
          if (
            payload &&
            payload.new &&
            payload.new.user_id === currentUser.id &&
            !shoppingLists
              .map((sl) => sl.id)
              .includes(payload.new.shopping_list_id)
          ) {
            const resultLists = await fetchShoppingListsByUserId(
              currentUser.id
            );
            setShoppingLists(resultLists);
          }
        }
      )
      .subscribe();

    const deleteChannel = supabase
      .channel("delte_list_access")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "shopping_lists_access" },
        async (payload) => {
          if (
            payload &&
            payload.old &&
            payload.old.user_id === currentUser.id &&
            !shoppingLists
              .map((sl) => sl.id)
              .includes(payload.old.shopping_list_id)
          ) {
            setShoppingLists((prev) =>
              prev.filter((list) => list.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      insertChannel.unsubscribe();
      deleteChannel.unsubscribe();
    };
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        if (user) {
          initializeSubscriptions(user);
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    if (user) {
      initializeSubscriptions(user);
    }
    fetchShoppingLists();
    return () => {
      subscription.remove();
    };
  }, [user, shoppingLists, appState]);

  return {
    shoppingLists,
    setShoppingLists,
  };
};

export default useShoppingLists;
