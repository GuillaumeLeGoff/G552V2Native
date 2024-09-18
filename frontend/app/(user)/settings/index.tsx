import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { router } from "expo-router";
import { Button } from "~/components/ui/button";

export default function Settings() {
  const { token, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold mb-8">Paramètres</Text>
      <Button
        variant="destructive"
        onPress={handleSignOut}
        className="px-4 py-2"
      >
        <Text className="text-white">Se déconnecter</Text>
      </Button>
    </View>
  );
}
