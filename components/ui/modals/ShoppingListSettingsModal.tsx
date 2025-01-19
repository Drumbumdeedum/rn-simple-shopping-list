import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { FriendStatus, ShoppingList } from "@/types";
import useUserStore from "@/state/userStore";
import CardView from "../CardView";
import { Entypo } from "@expo/vector-icons";
import { getAccessByListId, shareShoppingList } from "@/hooks/shoppingList";

type ShoppingListSettingsModal = {
  shoppingList: ShoppingList | null;
  modalVisible: boolean;
  onClose: () => void;
};

const ShoppingListSettingsModal = ({
  shoppingList,
  modalVisible,
  onClose,
}: ShoppingListSettingsModal) => {
  const theme = useColorScheme();
  const { user, friends } = useUserStore();
  const [usersWithAccess, setUsersWithAccess] = useState<string[]>([]);

  const onShareList = (friend: FriendStatus) => {
    if (shoppingList) {
      shareShoppingList(shoppingList?.id, friend.id);
      setUsersWithAccess((prev) => [...prev, friend.id]);
    }
  };

  useEffect(() => {
    setUsersWithAccess([]);
    const getAccessList = async () => {
      if (shoppingList) {
        const result = await getAccessByListId(shoppingList?.id);
        setUsersWithAccess(result.map((res) => res.user_id));
      }
    };
    getAccessList();
  }, [shoppingList]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: Colors[theme ?? "light"].background },
            ]}
          >
            {shoppingList && (
              <ThemedText
                type="title"
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor:
                      Colors[theme ?? "light"].backgroundSecondary,
                  },
                ]}
              >
                {shoppingList.name}
              </ThemedText>
            )}

            <ThemedView style={styles.modalContent}>
              {shoppingList && user && shoppingList.user_id === user?.id ? (
                <ThemedView>
                  <ThemedText style={styles.shareTitle} type="subtitle">
                    Share with friends:
                  </ThemedText>
                  {friends.length > 0 && (
                    <FlatList
                      style={styles.listItems}
                      data={friends}
                      renderItem={({ item }) => (
                        <CardView onPress={() => onShareList(item)}>
                          <ThemedText style={styles.email}>
                            {item.email}
                          </ThemedText>
                          <View style={styles.iconContainer}>
                            <Entypo
                              style={styles.icon}
                              name="circle"
                              size={24}
                              color={Colors[theme ?? "light"].tint}
                            />
                            {usersWithAccess.includes(item.id) && (
                              <Entypo
                                style={[styles.icon, styles.iconCheck]}
                                name="check"
                                size={16}
                                color={Colors[theme ?? "light"].tint}
                              />
                            )}
                          </View>
                        </CardView>
                      )}
                    />
                  )}
                </ThemedView>
              ) : (
                <ThemedText>A friend is sharing this list with you</ThemedText>
              )}
            </ThemedView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ShoppingListSettingsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  modalContent: {
    padding: 12,
    borderRadius: 10,
  },
  shareTitle: {
    marginBottom: 10,
  },
  listItems: {
    margin: -12,
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },
  email: {
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
    position: "absolute",
    top: 4,
    left: 3,
  },
});
