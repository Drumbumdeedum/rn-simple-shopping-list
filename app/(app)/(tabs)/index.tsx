import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  View,
  GestureResponderEvent,
  Modal,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import useUserStore from "@/state/userStore";
import ThemedInput from "@/components/ui/ThemedInput";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  createNewShoppingList,
  fetchShoppingListsByUserId,
} from "@/hooks/shoppingList";
import { formatDate } from "@/utils/dateUtils";
import { Entypo } from "@expo/vector-icons";
import { ShoppingList } from "@/types";
import CardView from "@/components/ui/CardView";
import ShoppingListSettingsModal from "@/components/ui/modals/ShoppingListSettingsModal";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const theme = useColorScheme();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [listName, setListName] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      if (user) {
        const resultLists = await fetchShoppingListsByUserId(user.id);
        setShoppingLists(resultLists);
      }
    };
    fetchShoppingLists();
  }, [user]);

  const handleCreateNewShoppingList = async () => {
    if (user) {
      const result = await createNewShoppingList(user.id, listName);
      setShoppingLists((prev) => [...prev, result]);
      setListName("");
    }
  };

  const onEdit = (event: GestureResponderEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setModalVisible(true);
  };
  const handleModalClose = () => setModalVisible(false);

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        {
          backgroundColor: Colors[theme ?? "light"].backgroundSecondary,
        },
      ]}
    >
      <ShoppingListSettingsModal
        modalVisible={modalVisible}
        onClose={handleModalClose}
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
                onPress={(e) => onEdit(e)}
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
