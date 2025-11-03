// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack screenOptions={{ headerStyle: { backgroundColor: "#fff" }, headerTintColor: "#111" }} />;
}
