import { Redirect, Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { useAuthStore } from "../store/authStore";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const { token } = useAuthStore();
  if (token === undefined || token === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <Slot />
        <Redirect href="/(auth)" />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <Slot />
        <Redirect href="/(user)/playlists" />
      </SafeAreaView>
    );
  }
};

export default RootLayout;
