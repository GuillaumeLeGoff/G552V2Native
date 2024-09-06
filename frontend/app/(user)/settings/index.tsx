import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthStore } from "~/store/authStore";
import { router } from "expo-router";

export default function Settings() {
  const { session, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenue, {session}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={{ marginTop: 20, backgroundColor: "red", padding: 10 }}
      >
        <Text style={{ color: "white" }}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}
