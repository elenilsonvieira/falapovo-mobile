import React from "react";
import {
  Modal, StyleSheet, Text,
  TouchableOpacity,
  View
} from "react-native";

export type ConfirmModalProps = {
  visible: boolean;
  message: string;
  onConfirm: () => any;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>SIM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>NÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
