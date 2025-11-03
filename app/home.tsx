// app/(tabs)/home.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeTab() {
  return (
    <View style={st.container}>
      <Text>Relacional (opcional)</Text>
    </View>
  );
}

const st = StyleSheet.create({ container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F7FA" } });
