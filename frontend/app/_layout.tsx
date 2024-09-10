import { Redirect, Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { useAuthStore } from "~/store/authStore";
import "../global.css";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {false ? (
        <Redirect href="/(user)/playlists" />
      ) : (
        <Redirect href="/(auth)" />
      )}
      <Slot />
    </SafeAreaView>
  );
};

export default RootLayout;
