
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = { title: string; onPress?: () => void; disabled?: boolean };

export default function ButtonPrimary({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity style={[styles.button, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: "#3498db", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: "center" },
  text: { color: "#fff", fontWeight: "700" },
  disabled: { opacity: 0.6 },
});
