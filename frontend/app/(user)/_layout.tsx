import { Slot, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          href: null,
        }}
      />
      <Tabs.Screen
        name="playlists/index"
        options={{
          tabBarLabel: "Playlist",
        }}
      />
      <Tabs.Screen
        name="medias/[folderId]/index"
        options={{
          tabBarLabel: "Media",
        }}
      />
      <Tabs.Screen
        name="macros/index"
        options={{
          tabBarLabel: "Macro",
        }}
      />
      <Tabs.Screen
        name="scoreboard/index"
        options={{
          tabBarLabel: "Scoreboard",
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          tabBarLabel: "Setting",
        }}
      />
    </Tabs>
  );
}
