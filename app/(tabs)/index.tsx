// app/index.tsx
import React, { useMemo, useState } from "react";
import { SafeAreaView, View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import useHunters from "@/src/hooks/useHunters";
import HunterCard from "@/src/components/HunterCard";

export default function Index() {
  const { hunters, loading, reload } = useHunters();
  const [q, setQ] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return hunters;
    return hunters.filter((h: any) => {
      const nombre = (h.nombre ?? "").toLowerCase();
      const id = String((h as any).id ?? (h as any)._id ?? "");
      return nombre.includes(t) || id.includes(t);
    });
  }, [q, hunters]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.input} placeholder="Buscar por nombre o id..." value={q} onChangeText={setQ} />
        <TouchableOpacity style={styles.add} onPress={() => router.push("/create")}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {loading ? <Text>Cargando...</Text> : filtered.map((h: any) => <HunterCard key={(h as any).id ?? (h as any)._id} hunter={h} />)}
      </ScrollView>

      <TouchableOpacity style={styles.reload} onPress={reload}>
        <Text style={{ color: "#fff", fontSize: 20 }}>↻</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { flexDirection: "row", padding: 12, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, backgroundColor: "#fff" },
  add: { marginLeft: 8, backgroundColor: "#1E88E5", padding: 10, borderRadius: 8 },
  reload: { position: "absolute", right: 16, bottom: 20, backgroundColor: "#1E88E5", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 30 },
});
