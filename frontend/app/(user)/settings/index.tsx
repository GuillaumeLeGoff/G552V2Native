import { router } from "expo-router";
import React from "react";
import AnimatedScrollView from "~/components/AnimatedScrollView";
import { Button } from "~/components/ui/button";
import { Header } from "~/components/ui/header";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";

export default function Settings() {
  const { token, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <AnimatedScrollView>
      <Header title="Settings" />
      <Button
        variant="destructive"
        onPress={handleSignOut}
        className="px-4 py-2"
      >
        <Text className="text-white">Se déconnecter</Text>
      </Button>
    </AnimatedScrollView>
  );
}
