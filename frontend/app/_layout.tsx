import { Redirect, Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import "../global.css";
import { useAuthStore } from "../store/authStore";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const { token } = useAuthStore();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Slot />
      <PortalHost />
      {token === undefined || token === null ? (
        <Redirect href="/(auth)" />
      ) : (
        <Redirect href="/(user)/(tab)/playlists" />
      )}
    </SafeAreaView>
  );
};

export default RootLayout;
