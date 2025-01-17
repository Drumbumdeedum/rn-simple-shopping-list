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
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  createNewShoppingList,
  fetchShoppingListsByUserId,
} from "@/hooks/shoppingList";
import { formatDate } from "@/utils/dateUtils";
import { Entypo } from "@expo/vector-icons";
import { ShoppingList } from "@/types";

export default function HomeScreen() {
  const { user } = useUserStore();
  const theme = useColorScheme();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [listName, setListName] = useState<string>("");

  useEffect(() => {
    const fetchShoppingLists = async () => {
      if (user) {
        const resultLists = await fetchShoppingListsByUserId(user.id);
        setShoppingLists(resultLists);
      }
    };
    fetchShoppingLists();
  }, []);

  const handleCreateNewShoppingList = async () => {
    if (user) {
      const result = await createNewShoppingList(user.id, listName);
      setShoppingLists((prev) => [...prev, result]);
    }
  };

  const onEdit = (event: GestureResponderEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("TODO: IMPLEMENT LIST EDIT");
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
      <ThemedView
        style={[
          styles.header,
          {
            borderColor: Colors[theme ?? "light"].icon,
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
            <Link
              href={{
                pathname: "/shoppingList/[id]",
                params: { id: item.id },
              }}
              style={styles.card}
            >
              <TouchableOpacity style={styles.cardContent}>
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
              </TouchableOpacity>
            </Link>
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
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});
