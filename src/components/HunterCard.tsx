// src/components/HunterCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Hunter } from "../types/hunter";

export default function HunterCard({ hunter }: { hunter: Hunter }) {
  const router = useRouter();
  const image = (hunter as any).imageurl ?? (hunter as any).imageUrl ?? "";

  return (
    <View style={cStyles.card}>
      {image ? <Image source={{ uri: image }} style={cStyles.image} /> : <View style={[cStyles.image, cStyles.placeholder]}><Text>Sin imagen</Text></View>}
      <View style={cStyles.info}>
        <Text style={cStyles.name}>{hunter.nombre}</Text>
        <Text style={cStyles.line}>Edad: {hunter.edad ?? "-"}</Text>
        <Text style={cStyles.line}>Altura: {hunter.altura ?? "-"}</Text>
        <Text style={cStyles.line}>Peso: {hunter.peso ?? "-"}</Text>
        <Text style={cStyles.origin}>{hunter.origen === "relacional" ? "Postgres" : "MongoDB"}</Text>

        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <TouchableOpacity
            style={[cStyles.btn, cStyles.btnEdit]}
            onPress={() => router.push({ pathname: "/edit", params: { id: String(hunter.id ?? hunter._id), origen: hunter.origen } })}
          >
            <Text style={cStyles.btnText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[cStyles.btn, cStyles.btnDel]}
            onPress={() => router.push({ pathname: "/modal", params: { id: String(hunter.id ?? hunter._id), origen: hunter.origen } })}
          >
            <Text style={cStyles.btnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const cStyles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#FFFFFF", marginVertical: 8, padding: 10, borderRadius: 10, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eee" },
  placeholder: { justifyContent: "center", alignItems: "center" },
  info: { marginLeft: 12, flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#222" },
  line: { color: "#777", marginTop: 4 },
  origin: { marginTop: 6, fontSize: 12, color: "gray" },
  btn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  btnEdit: { backgroundColor: "#FFC107" },
  btnDel: { backgroundColor: "#E53935" },
  btnText: { color: "#fff", fontWeight: "600" },
});
