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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalContainer]}>
            <ThemedText style={styles.modalText}>
              Hello, I'm a Modal!
            </ThemedText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <ThemedText style={styles.buttonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
            <TouchableOpacity
              onPress={() => router.push(`/shoppingList/${item.id}`)}
              style={styles.card}
            >
              <View style={styles.cardContent}>
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
              </View>
            </TouchableOpacity>
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
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 5px 05px rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    gap: 6,
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  // -- MODAL STYLES --
  openButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: "#FF5A5F",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
