// app/edit.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import * as relApi from "../src/api/huntersRelational";
import * as noApi from "../src/api/huntersNosql";
import useHunters from "../src/hooks/useHunters";

export default function Edit() {
  const { id, origen } = useLocalSearchParams() as { id?: string; origen?: string };
  const router = useRouter();
  const { hunters, reload } = useHunters();

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = hunters.find((h: any) => String(h.id ?? h._id) === String(id));
    if (!found) return;
    setNombre(found.nombre ?? "");
    setEdad(String(found.edad ?? ""));
    setAltura(String(found.altura ?? ""));
    setPeso(String(found.peso ?? ""));
    setImageurl(found.imageurl ?? found.imageUrl ?? "");
  }, [id, hunters]);

  async function handleSave() {
    if (!id) return;
    setSaving(true);

    const payload =
      origen === "relacional"
        ? { nombre, edad: Number(edad), altura: Number(altura), peso: Number(peso), imageurl }
        : { nombre, edad: Number(edad), altura: Number(altura), peso: Number(peso), imageUrl: imageurl };

    try {
      const res = origen === "relacional" ? await relApi.updateHunter(Number(id), payload) : await noApi.updateHunter(String(id), payload);
      // relApi.updateHunter returns Response; noApi.updateHunter returns Response
      if (!res || ("ok" in res && !res.ok)) throw new Error("Error actualizando");
      Alert.alert("Éxito", "Actualizado");
      reload();
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        <Text style={st.label}>Nombre</Text>
        <TextInput style={st.input} value={nombre} onChangeText={setNombre} />

        <Text style={st.label}>Edad</Text>
        <TextInput style={st.input} value={edad} onChangeText={setEdad} keyboardType="numeric" />

        <Text style={st.label}>Altura</Text>
        <TextInput style={st.input} value={altura} onChangeText={setAltura} keyboardType="numeric" />

        <Text style={st.label}>Peso</Text>
        <TextInput style={st.input} value={peso} onChangeText={setPeso} keyboardType="numeric" />

        <Text style={st.label}>URL Imagen</Text>
        <TextInput style={st.input} value={imageurl} onChangeText={setImageurl} />

        <TouchableOpacity style={[st.btn, { backgroundColor: "#1976D2" }]} onPress={handleSave} disabled={saving}>
          <Text style={st.btnText}>Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[st.btn, { backgroundColor: "#777" }]} onPress={() => router.back()}>
          <Text style={st.btnText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  label: { marginTop: 8, marginBottom: 4, color: "#555", fontWeight: "600" },
  btn: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "700" },
});
