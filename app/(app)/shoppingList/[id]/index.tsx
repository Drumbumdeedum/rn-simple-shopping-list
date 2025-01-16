import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createNewShoppingListItem,
  updateShoppingListItemChecked,
} from "@/hooks/shoppingListItem";
import { ShoppingListItem } from "@/types";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ThemedInput from "@/components/ui/ThemedInput";
import { TextInput } from "react-native-gesture-handler";
import useShoppingListItems from "@/hooks/shoppingListItem/useShoppingListItems";

const ShoppingList = () => {
  const { id } = useLocalSearchParams();
  if (!id) return;
  const { listItems } = useShoppingListItems(id as string);
  const [itemName, setItemName] = useState<string>("");
  const router = useRouter();
  const theme = useColorScheme();
  const inputRef = useRef<TextInput>(null);

  const handleCreateNewItem = async () => {
    if (id && typeof id === "string") {
      await createNewShoppingListItem(id, itemName);
      setItemName("");
    }
  };

  const handleItemChecked = async (item: ShoppingListItem) => {
    if (id && typeof id === "string") {
      await updateShoppingListItemChecked(item.id, !item.checked);
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
            ref={inputRef}
            placeholder="New item"
            value={itemName}
            onChange={(e) => setItemName(e.nativeEvent.text)}
            onSubmitEditing={handleCreateNewItem}
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
              onPress={() => handleItemChecked(item)}
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
