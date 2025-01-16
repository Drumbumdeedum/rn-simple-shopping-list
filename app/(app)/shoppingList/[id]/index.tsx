import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchShoppingListItemsByShoppingListId } from "@/hooks/shoppingListItems";
import { ShoppingListItem } from "@/types";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const ShoppingList = () => {
  const { id } = useLocalSearchParams();
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);
  const router = useRouter();
  const theme = useColorScheme();

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchShoppingListItemsByShoppingListId(id as string);
      setListItems(items);
    };
    fetchItems();
  }, []);

  return (
    <SafeAreaView style={styles.listContainer}>
      <ThemedView style={styles.listContainer}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <ThemedText> {"< BACK"}</ThemedText>
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
    gap: 12,
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
