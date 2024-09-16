import { Redirect, Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { useAuthStore } from "../store/authStore";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const { token } = useAuthStore();

  if (token === undefined) {
    return null; // ou un écran de chargement
  }

  return (

      <SafeAreaView style={{ flex: 1 }}>
        {token ? (
        <Redirect href="/(user)/playlists" />
      ) : (
        <Redirect href="/(auth)" />
      )}
        <Slot />
      </SafeAreaView>

  );
};

export default RootLayout;
