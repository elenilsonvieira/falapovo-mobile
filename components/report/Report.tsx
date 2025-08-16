import { IconSymbol } from "@/components/ui/IconSymbol";
import { ReportStatus } from "@/interfaces/IReport";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ConfirmModal from "../ui/ConfirmModal";

export type ReportProps = {
  id: number;
  message: string;
  adressLocation: string;
  category: string;
  date: string;
  image: string;
  status: ReportStatus;
  onDelete: (id: number) => void;
  openForm: (id?: string) => void;
};

export const statusColors: Record<ReportStatus, string> = {
  "Em análise": "#dc3545",
  "Em andamento": "#ffc107",
  "Concluído": "#28a745",
};

export default function Report({
  id,
  message,
  category,
  adressLocation,
  date,
  image,
  status,
  onDelete,
  openForm
}: ReportProps) {
  const color = statusColors[status] || "#6c757d";
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : null}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>
              #{category ? category.toUpperCase() : "SEM CATEGORIA"}
            </Text>

            <View style={styles.rightSection}>
              <View style={styles.actions}>
                {}
                {status === 'Em análise' && (
                  <TouchableOpacity onPress={() => {openForm(id.toString())}}>
                    <IconSymbol size={28} name="square.and.pencil" color={'blue'} style={{marginRight: 15}} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => {setModalVisible(true)}}>
                  <IconSymbol size={28} name="trash" color={'red'} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.status, { color, borderColor: color }]}>
                {status}
              </Text>
            </View>
          </View>

          <Text style={styles.message}>{message}</Text>
          {adressLocation && <Text style={styles.info}>📍 {adressLocation}</Text>}
          <Text style={styles.info}>📅 {date}</Text>
        </View>

        <ConfirmModal
          visible={modalVisible}
          message="Deseja excluir esta denúncia?"
          onConfirm={() => {
            onDelete(id);
            setModalVisible(false);
          }}
          onCancel={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: "100%",
    maxWidth: 350,
    overflow: "hidden",
  },
  imagePreview: { width: "100%", height: 200, resizeMode: "cover" },
  content: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  category: { fontSize: 14, fontWeight: "bold", color: "#ff9900" },
  rightSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    position: "relative",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    position: "absolute",
    top: -18,
    right: 0,
  },
  iconButton: {
    fontSize: 16,
    opacity: 0.7,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 15,
  },
  message: { fontSize: 16, color: "#333", marginBottom: 12 },
  info: { fontSize: 13, color: "#666", marginBottom: 4 },
});
