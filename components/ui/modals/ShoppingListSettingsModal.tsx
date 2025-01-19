import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

type ShoppingListSettingsModal = {
  modalVisible: boolean;
  onClose: () => void;
};

const ShoppingListSettingsModal = ({
  modalVisible,
  onClose,
}: ShoppingListSettingsModal) => {
  const theme = useColorScheme();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: Colors[theme ?? "light"].background },
          ]}
        >
          <ThemedText>Hello, I'm a Modal!</ThemedText>
          <TouchableOpacity onPress={onClose}>
            <ThemedText>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
