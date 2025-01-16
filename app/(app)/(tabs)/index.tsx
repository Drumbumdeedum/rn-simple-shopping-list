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
import { Link } from "expo-router";

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
            <Link
              href={{
                pathname: "/shoppingList/[id]",
                params: { id: item.id },
              }}
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
              <TouchableOpacity>
                <ThemedText>{item.name}</ThemedText>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.random() * 100}%` },
                    ]}
                  />
                </View>
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
    flexDirection: "column",
    gap: 18,
    width: "100%",
  },
  separator: {
    height: 12,
    opacity: 0,
    backgroundColor: "transparent",
  },
  progressBar: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 10,
  },
});
