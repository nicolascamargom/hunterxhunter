// app/formulario.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as api from "@/src/api/hunters";

export default function Formulario() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined;

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [saving, setSaving] = useState(false);
  const [destino, setDestino] = useState<"relacional" | "nosql">("relacional");

 useEffect(() => {
  // Si viene editId cargamos valores
  (async () => {
    if (!editId) return;
    const all = await api.getAllHunters();
    const found = all.find((h: any) => String(h.id ?? h._id) === String(editId));
    if (!found) return;
    setNombre(found.nombre ?? "");
    setEdad(String(found.edad ?? ""));
    setAltura(String(found.altura ?? ""));
    setPeso(String(found.peso ?? ""));
   setImageurl(found.imageUrl ?? found.imageUrl ?? "");
   setDestino(found.origen === "relacional" ? "relacional" : "nosql");
  })();
}, [editId]);

  async function existsName(name: string) {
    const all = await api.getAllHunters();
    return all.some(
      (h: any) =>
        (h.nombre ?? "").toLowerCase() === name.toLowerCase() &&
        String(h.id ?? h._id) !== String(editId ?? "")
    );
  }

  async function handleSave(target: "relacional" | "nosql") {
    if (!nombre || !imageurl) {
      Alert.alert("Validación", "Nombre e imagen obligatorios");
      return;
    }
    setSaving(true);

    const duplicate = await existsName(nombre);
    if (duplicate) {
      Alert.alert("Error", "El personaje ya existe en alguna base");
      setSaving(false);
      return;
    }

    const payload = {
      nombre,
      edad: edad ? Number(edad) : null,
      altura: altura ? Number(altura) : null,
      peso: peso ? Number(peso) : null,
      ...(target === "relacional" ? { imageurl } : { imageUrl: imageurl }),
    };

    try {
      if (editId) {
        await api.updateHunter(editId, destino, payload);
        Alert.alert("OK", "Actualizado");
      } else {
        const res = await api.createHunter(payload, target);
        if (!res.ok) throw new Error("Error creando");
        Alert.alert("OK", "Creado");
      }
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Edad</Text>
      <TextInput style={styles.input} value={edad} onChangeText={setEdad} keyboardType="numeric" />

      <Text style={styles.label}>Altura (cm)</Text>
      <TextInput style={styles.input} value={altura} onChangeText={setAltura} keyboardType="numeric" />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput style={styles.input} value={peso} onChangeText={setPeso} keyboardType="numeric" />

      <Text style={styles.label}>URL Imagen</Text>
      <TextInput style={styles.input} value={imageurl} onChangeText={setImageurl} />

      <Text style={[styles.label, { marginTop: 12 }]}>Guardar en</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TouchableOpacity style={[styles.choice, destino === "relacional" && styles.choiceActive]} onPress={() => setDestino("relacional")}>
          <Text>Relacional</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.choice, destino === "nosql" && styles.choiceActive]} onPress={() => setDestino("nosql")}>
          <Text>NoSQL</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.save, { backgroundColor: "#0275d8" }]} onPress={() => handleSave(destino)} disabled={saving}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{editId ? "Actualizar" : "Guardar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.save, { backgroundColor: "#999", marginTop: 8 }]} onPress={() => router.back()}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  label: { marginTop: 8, marginBottom: 4, color: "#D9534F" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  choice: { padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginRight: 8 },
  choiceActive: { backgroundColor: "#e6f0ff", borderColor: "#0275d8" },
  save: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 12 },
});
