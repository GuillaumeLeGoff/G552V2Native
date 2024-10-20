import React from "react";
import { Animated } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { router } from "expo-router";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/ui/header";

export default function Settings() {
  const { token, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <Animated.ScrollView>
      <Header title="Settings" />
      <Button
        variant="destructive"
        onPress={handleSignOut}
        className="px-4 py-2"
      >
        <Text className="text-white">Se déconnecter</Text>
      </Button>
    </Animated.ScrollView>
  );
}
