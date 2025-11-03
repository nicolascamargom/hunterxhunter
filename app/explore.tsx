// app/(tabs)/explore.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function Explore() {
  return (
    <View style={styles.container}>
      <Text>Explora (opcional)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  }
});
