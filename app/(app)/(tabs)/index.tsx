import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  View,
  GestureResponderEvent,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import useUserStore from "@/state/userStore";
import ThemedInput from "@/components/ui/ThemedInput";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  createNewShoppingList,
  deleteShoppingListAccess,
} from "@/hooks/shoppingList";
import { formatDate } from "@/utils/dateUtils";
import { Entypo } from "@expo/vector-icons";
import { ShoppingList } from "@/types";
import CardView from "@/components/ui/CardView";
import EditShoppingListModal from "@/components/ui/modals/EditShoppingListModal";
import ConfirmDeleteModal from "@/components/ui/modals/ConfirmDeleteModal";
import useShoppingLists from "@/hooks/shoppingList/useShoppingLists";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const theme = useColorScheme();
  const { shoppingLists, setShoppingLists } = useShoppingLists();
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [listName, setListName] = useState<string>("");
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [deleteListModalVisible, setDeleteListModalVisible] = useState(false);

  const handleCreateNewShoppingList = async () => {
    if (user) {
      const result = await createNewShoppingList(user.id, listName);
      setShoppingLists((prev) => [...prev, result]);
      setListName("");
    }
  };

  const onOpenSettingsModal = (
    event: GestureResponderEvent,
    shoppingList: ShoppingList
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedList(shoppingList);
    setSettingsModalVisible(true);
  };

  const handleModalClose = () => {
    setSettingsModalVisible(false);
    setTimeout(() => {
      setSelectedList(null);
    }, 300);
  };

  const handleDeleteList = () => {
    setSettingsModalVisible(false);
    setDeleteListModalVisible(true);
  };

  const confirmDeleteList = async () => {
    if (user && selectedList) {
      await deleteShoppingListAccess(user.id, selectedList.id);
      setShoppingLists((prev) =>
        prev.filter((list) => list.id !== selectedList.id)
      );
      setSelectedList(null);
      setDeleteListModalVisible(false);
    }
  };

  const handleDeleteListModalClose = () => {
    setDeleteListModalVisible(false);
    setTimeout(() => {
      setSelectedList(null);
    }, 300);
  };

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        {
          backgroundColor: Colors[theme ?? "light"].backgroundSecondary,
        },
      ]}
    >
      <EditShoppingListModal
        shoppingList={selectedList}
        modalVisible={settingsModalVisible}
        onClose={handleModalClose}
        onDeleteList={handleDeleteList}
      />
      <ConfirmDeleteModal
        itemName={selectedList?.name || ""}
        deleteLabel={"Delete list"}
        modalVisible={deleteListModalVisible}
        onClose={handleDeleteListModalClose}
        onConfirm={confirmDeleteList}
      />
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
        <ThemedInput
          placeholder="List name"
          value={listName}
          onSubmitEditing={handleCreateNewShoppingList}
          onChange={(e) => setListName(e.nativeEvent.text)}
        />
        <TouchableOpacity onPress={handleCreateNewShoppingList}>
          <Entypo name="plus" size={24} color={Colors[theme ?? "light"].tint} />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.listContainer}>
        <FlatList
          style={styles.shoppingLists}
          data={shoppingLists}
          renderItem={({ item }) => (
            <CardView onPress={() => router.push(`/shoppingList/${item.id}`)}>
              <View style={styles.textContainer}>
                <ThemedText type="title">{item.name}</ThemedText>
                <ThemedText type="subtitle">
                  {formatDate(item.created_at)}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={(e) => onOpenSettingsModal(e, item)}
                style={styles.editButton}
              >
                <Entypo
                  name="dots-three-vertical"
                  size={24}
                  color={Colors[theme ?? "light"].tint}
                />
              </TouchableOpacity>
            </CardView>
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

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
  listContainer: {
    display: "flex",
    flex: 1,
  },
  shoppingLists: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },
  textContainer: {
    gap: 6,
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
});
