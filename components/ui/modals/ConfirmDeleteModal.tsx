import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { Entypo } from "@expo/vector-icons";

type ConfirmDeleteModalProps = {
  itemName: string;
  deleteLabel: string;
  modalVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({
  itemName,
  deleteLabel,
  modalVisible,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) => {
  const theme = useColorScheme();

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
            {itemName && (
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
                {deleteLabel}
              </ThemedText>
            )}
            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.warningText}>
                <ThemedText>
                  Are you shure you want to delete {itemName}?
                </ThemedText>
              </ThemedView>
              <ThemedView>
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[
                    styles.deleteButton,
                    { backgroundColor: Colors[theme ?? "light"].error },
                  ]}
                >
                  <ThemedText type="defaultSemiBold" style={styles.deleteText}>
                    {deleteLabel}
                  </ThemedText>
                  <Entypo name="trash" size={16} color={"#fff"} />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmDeleteModal;

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
  },
  warningText: {
    padding: 8,
    marginBottom: 12,
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
