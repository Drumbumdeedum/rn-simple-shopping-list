import {
  FlatList,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
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
import ThemedInput from "@/components/ui/ThemedInput";
import { TextInput } from "react-native-gesture-handler";
import useShoppingListItems from "@/hooks/shoppingListItem/useShoppingListItems";
import { Entypo } from "@expo/vector-icons";
import CardView from "@/components/ui/CardView";
import EditShoppingListItemModal from "@/components/ui/modals/EditShoppingListItemModal";

const ShoppingList = () => {
  const { id } = useLocalSearchParams();
  if (!id) return;
  const { listItems } = useShoppingListItems(id as string);
  const [itemName, setItemName] = useState<string>("");
  const router = useRouter();
  const theme = useColorScheme();
  const inputRef = useRef<TextInput>(null);
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const handleCreateNewItem = async () => {
    if (id && typeof id === "string") {
      await createNewShoppingListItem(id, itemName);
      setItemName("");
    }
  };

  const handleItemChecked = async (
    event: GestureResponderEvent,
    item: ShoppingListItem
  ) => {
    event.preventDefault();
    event.stopPropagation();
    await updateShoppingListItemChecked(item.id, !item.checked);
  };

  const openEditModal = async (item: ShoppingListItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setEditModalOpen(false);
  };

  const updateShoppingListItem = () => {
    console.log("UPDATE");
  };

  return (
    <SafeAreaView
      style={[
        styles.listContainer,
        { flex: 1 },
        {
          backgroundColor: Colors[theme ?? "light"].background,
        },
      ]}
    >
      <EditShoppingListItemModal
        shoppingListItem={selectedItem}
        modalOpen={editModalOpen}
        onClose={closeEditModal}
        onUpdate={updateShoppingListItem}
      />
      <ThemedView style={styles.listContainer}>
        <ThemedView
          style={[
            styles.header,
            {
              borderColor: Colors[theme ?? "light"].border,
            },
            {
              backgroundColor: Colors[theme ?? "light"].backgroundSecondary,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <Entypo
              name="chevron-left"
              size={24}
              color={Colors[theme ?? "light"].tint}
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
            <Entypo
              name="plus"
              size={24}
              color={Colors[theme ?? "light"].tint}
            />
          </TouchableOpacity>
        </ThemedView>
        <FlatList
          data={listItems}
          style={styles.listItems}
          renderItem={({ item }) => (
            <CardView onPress={() => openEditModal(item)}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={(e) => handleItemChecked(e, item)}>
                  <Entypo
                    style={styles.icon}
                    name="circle"
                    size={24}
                    color={Colors[theme ?? "light"].tint}
                  />
                  {item.checked && (
                    <Entypo
                      style={[styles.icon, styles.iconCheck]}
                      name="check"
                      size={18}
                      color={Colors[theme ?? "light"].tint}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </CardView>
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
    borderBottomWidth: 1,
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
  listItems: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },
  itemName: {
    flex: 1,
  },
  iconContainer: {
    position: "relative",
    width: 24,
    height: 24,
  },
  icon: {
    position: "absolute",
  },
  iconCheck: {
    top: 4,
    left: 3,
  },
});
