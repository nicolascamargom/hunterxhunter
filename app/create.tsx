// app/create.tsx
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as relApi from "../src/api/huntersRelational";
import * as noApi from "../src/api/huntersNosql";
import { getAll } from "../src/utils/fetcher";

export default function Create() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [saving, setSaving] = useState(false);

  async function existsName(name: string) {
    const all = await getAll();
    return all.some((h: any) => (h.nombre ?? "").toLowerCase() === name.toLowerCase());
  }

  async function submit(destino: "relacional" | "nosql") {
    if (!nombre || !imageurl) {
      Alert.alert("Validación", "Nombre e imagen obligatorios");
      return;
    }
    setSaving(true);
    if (await existsName(nombre)) {
      Alert.alert("Error", "Personaje ya existe");
      setSaving(false);
      return;
    }

    const payload =
      destino === "relacional"
        ? { nombre, edad: edad ? Number(edad) : null, altura: altura ? Number(altura) : null, peso: peso ? Number(peso) : null, imageurl }
        : { nombre, edad: edad ? Number(edad) : null, altura: altura ? Number(altura) : null, peso: peso ? Number(peso) : null, imageUrl: imageurl };

    try {
      const res = destino === "relacional" ? await relApi.createHunter(payload) : await noApi.createHunter(payload);
      if (!res.ok) throw new Error("Error creando");
      Alert.alert("Éxito", "Creado");
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
        <Text style={st.label}>Altura (cm)</Text>
        <TextInput style={st.input} value={altura} onChangeText={setAltura} keyboardType="numeric" />
        <Text style={st.label}>Peso (kg)</Text>
        <TextInput style={st.input} value={peso} onChangeText={setPeso} keyboardType="numeric" />
        <Text style={st.label}>URL imagen</Text>
        <TextInput style={st.input} value={imageurl} onChangeText={setImageurl} />

        <Text style={[st.label, { marginTop: 12 }]}>Guardar en</Text>
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <TouchableOpacity style={[st.choice]} onPress={() => submit("relacional")}>
            <Text style={{ color: "#fff" }}>Relacional</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[st.choice, { marginLeft: 8, backgroundColor: "#666" }]} onPress={() => submit("nosql")}>
            <Text style={{ color: "#fff" }}>NoSQL</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[st.save, { backgroundColor: "#999", marginTop: 8 }]} onPress={() => router.back()}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  label: { marginTop: 8, marginBottom: 4, color: "#777" },
  choice: { padding: 12, borderRadius: 8, backgroundColor: "#1E88E5", alignItems: "center" },
  save: { padding: 12, borderRadius: 8, alignItems: "center" },
});
