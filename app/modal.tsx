// app/modal.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import * as relApi from "../src/api/huntersRelational";
import * as noApi from "../src/api/huntersNosql";

export default function Modal() {
  const { id, origen } = useLocalSearchParams() as { id?: string; origen?: string };
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!id || !origen) return Alert.alert("Error", "Faltan datos para eliminar");
    try {
      setLoading(true);
      if (origen === "relacional") {
        await relApi.deleteHunter(Number(id));
      } else {
        await noApi.deleteHunter(String(id));
      }
      Alert.alert("Éxito", "Personaje eliminado correctamente");
      router.dismiss();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudo eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.overlay}>
      <View style={s.box}>
        <Text style={s.title}>¿Eliminar personaje?</Text>
        <Text style={s.subtitle}>ID: {id}</Text>
        <Text style={s.subtitle}>Origen: {origen}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 20 }} />
        ) : (
          <>
            <TouchableOpacity style={[s.btn, s.btnDelete]} onPress={handleDelete}>
              <Text style={s.btnText}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.btn, s.btnCancel]} onPress={() => router.dismiss()}>
              <Text style={s.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  box: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#444" },
  btn: { width: "100%", paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: "center" },
  btnDelete: { backgroundColor: "#d32f2f" },
  btnCancel: { backgroundColor: "#607d8b" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
