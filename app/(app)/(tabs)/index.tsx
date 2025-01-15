import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  FlatList,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import useUserStore from "@/state/userStore";
import ThemedInput from "@/components/ui/ThemedInput";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchShoppingListsByUserId } from "@/hooks/shoppingList";
import useShoppingListStore from "@/state/shoppingListStore";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const { user, setUser } = useUserStore();
  const { shoppingLists } = useShoppingListStore();
  const theme = useColorScheme();

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <ThemedView style={styles.header}>
        <ThemedInput placeholder="List name" />
        <TouchableOpacity>
          <IconSymbol
            size={32}
            name="plus.circle"
            color={theme === "light" ? Colors.light.tint : Colors.dark.tint}
          />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.listContainer}>
        <FlatList
          style={styles.shoppingLists}
          data={shoppingLists}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <ThemedView
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
              <ThemedText>{item.name}</ThemedText>
            </ThemedView>
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
  },
  separator: {
    height: 18,
    opacity: 0,
    backgroundColor: "transparent",
  },
});
