import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ShoppingListItem } from "@/types";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import ThemedInput from "../ThemedInput";
import { Entypo } from "@expo/vector-icons";

type EditShoppingListItemModalProps = {
  modalOpen: boolean;
  shoppingListItem: ShoppingListItem | null;
  onClose: () => void;
  onUpdate: () => void;
};

const EditShoppingListItemModal = ({
  modalOpen,
  shoppingListItem,
  onClose,
  onUpdate,
}: EditShoppingListItemModalProps) => {
  const inputRef = useRef(null);
  const theme = useColorScheme();
  const [item, setItem] = useState<ShoppingListItem | null>(shoppingListItem);
  const [itemName, setItemName] = useState<string>(
    shoppingListItem ? shoppingListItem.name : ""
  );

  useEffect(() => {
    if (shoppingListItem && shoppingListItem.name !== itemName) {
      setItem(shoppingListItem);
      setItemName(shoppingListItem.name);
    }
  }, [shoppingListItem]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: Colors[theme ?? "light"].background },
                ]}
              >
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
                  Edit item
                </ThemedText>
                <ThemedView style={styles.modalContent}>
                  <ThemedInput
                    ref={inputRef}
                    value={itemName}
                    onChangeText={setItemName}
                  />

                  <ThemedView>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[
                        styles.deleteButton,
                        { backgroundColor: Colors[theme ?? "light"].error },
                      ]}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.deleteText}
                      >
                        Delete list
                      </ThemedText>
                      <Entypo name="trash" size={16} color={"#fff"} />
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditShoppingListItemModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  deleteButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
  },
});
