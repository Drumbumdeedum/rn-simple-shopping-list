import {
  FlatList,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createNewShoppingListItem,
  deleteShoppingListItem,
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
import ConfirmDeleteModal from "@/components/ui/modals/ConfirmDeleteModal";

const ShoppingList = () => {
  const { id } = useLocalSearchParams();
  if (!id) return;
  const { listItems, setListItems } = useShoppingListItems(id as string);
  const [itemName, setItemName] = useState<string>("");
  const router = useRouter();
  const theme = useColorScheme();
  const inputRef = useRef<TextInput>(null);
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteItemModalVisible, setDeleteItemModalVisible] = useState(false);

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

  const handleDeleteItem = () => {
    setEditModalOpen(false);
    setDeleteItemModalVisible(true);
  };

  const handleDeleteItemModalClose = () => {
    setDeleteItemModalVisible(false);
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  const confirmDeleteItem = async () => {
    if (selectedItem) {
      await deleteShoppingListItem(selectedItem.id);
      setListItems((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setSelectedItem(null);
      setDeleteItemModalVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.listContainer,
        { flex: 1 },
        {
          backgroundColor: Colors[theme ?? "light"].backgroundSecondary,
        },
      ]}
    >
      <EditShoppingListItemModal
        shoppingListItem={selectedItem}
        modalOpen={editModalOpen}
        onClose={closeEditModal}
        onUpdate={updateShoppingListItem}
        onDeleteItem={handleDeleteItem}
      />
      <ConfirmDeleteModal
        itemName={selectedItem?.name || ""}
        deleteLabel={"Delete item"}
        modalVisible={deleteItemModalVisible}
        onClose={handleDeleteItemModalClose}
        onConfirm={confirmDeleteItem}
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
          data={listItems || []}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No items added.
            </ThemedText>
          }
          style={styles.listItems}
          renderItem={({ item }) =>
            item && (
              <CardView
                onPress={() => openEditModal(item)}
                style={{ padding: 0 }}
              >
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={(e) => handleItemChecked(e, item)}
                >
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
                      size={16}
                      color={Colors[theme ?? "light"].tint}
                    />
                  )}
                </TouchableOpacity>
              </CardView>
            )
          }
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
    padding: 18,
    flex: 1,
  },
  iconContainer: {
    width: 80,
    height: 60,
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 18,
    left: 36,
  },
  iconCheck: {
    top: 23,
    left: 40,
  },
});
