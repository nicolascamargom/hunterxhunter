// app/detalle.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image,  ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as api from "@/src/api/hunters";


export default function Detalle() {
  const { id, origen } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!id) return;
      const res = await api.getAllHunters(); // fallback to all then find
      const found = res.find((h: any) => String(h.id ?? h._id) === String(id) && h.origen === origen);
      if (found) setItem(found);
    })();
  }, [id, origen]);

  if (!item) return <View style={styles.container}><Text>Cargando...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>
      {item.imageurl ? <Image source={{ uri: item.imageurl }} style={styles.image} /> : null}
      <Text style={styles.title}>{item.nombre}</Text>
      <Text style={styles.line}>Edad: {item.edad ?? "-"}</Text>
      <Text style={styles.line}>Altura: {item.altura ?? "-"}</Text>
      <Text style={styles.line}>Peso: {item.peso ?? "-"}</Text>
      <Text style={styles.line}>Origen: {item.origen}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
  },
  line: {
    marginTop: 10,
    color: "#E67E22",
    fontSize: 15,
    fontStyle: "italic",
  },
});
