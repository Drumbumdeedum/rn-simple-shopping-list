import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createNewShoppingListItem,
  fetchShoppingListItemsByShoppingListId,
} from "@/hooks/shoppingListItem";
import { ShoppingListItem } from "@/types";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ThemedInput from "@/components/ui/ThemedInput";
import { supabase } from "@/utils/initSupabase";

const ShoppingList = () => {
  const { id } = useLocalSearchParams();
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);
  const [itemName, setItemName] = useState<string>("");
  const router = useRouter();
  const theme = useColorScheme();

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

  const handleCreateNewItem = async () => {
    if (id && typeof id === "string") {
      await createNewShoppingListItem(id, itemName);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.listContainer,
        { flex: 1 },
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <ThemedView style={styles.listContainer}>
        <ThemedView style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <IconSymbol
              size={24}
              name="chevron.left"
              color={theme === "light" ? Colors.light.tint : Colors.dark.tint}
            />
          </TouchableOpacity>
          <ThemedInput
            placeholder="List name"
            value={itemName}
            onChange={(e) => setItemName(e.nativeEvent.text)}
          />
          <TouchableOpacity onPress={handleCreateNewItem}>
            <IconSymbol
              size={32}
              name="plus.circle"
              color={theme === "light" ? Colors.light.tint : Colors.dark.tint}
            />
          </TouchableOpacity>
        </ThemedView>
        <FlatList
          data={listItems}
          style={styles.shoppingLists}
          ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.listCard,
                {
                  backgroundColor:
                    theme === "light"
                      ? Colors.light.elevatedBackground
                      : Colors.dark.elevatedBackground,
                },
              ]}
            >
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText>{item.checked ? "DONE" : "X"}</ThemedText>
            </TouchableOpacity>
          )}
        />
        <StatusBar style="auto" />
      </ThemedView>
    </SafeAreaView>
  );
};

export default ShoppingList;

const styles = StyleSheet.create({
  header: {
    padding: 18,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  listContainer: {
    display: "flex",
    flex: 1,
  },
  shoppingLists: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },
  listCard: {
    padding: 18,
    borderRadius: 5,
    boxShadow: "0px 5px 05px rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  separator: {
    height: 12,
    opacity: 0,
    backgroundColor: "transparent",
  },
  itemName: {
    flex: 1,
  },
});
