import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { Redirect, Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { Platform, View } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "~/store/authStore";
import { API_URL, PROTOCOL, IP_ADDRESS, API_PORT } from "@env";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initializeAuth, isInitialized, session } = useAuthStore();

  /*   React.useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    initialize();
  }, []); */
  /* 
  if (!isInitialized) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Chargement...</Text>
      </View>
    );
  } */

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
}
