import { Tabs } from "expo-router";
import { Folder } from "~/lib/icons/Folder";
import { Settings } from "~/lib/icons/Settings";
import { Image } from "~/lib/icons/Image";
import { Keyboard } from "~/lib/icons/Keyboard";
import { cn } from "~/lib/utils"; // Import cn
import { Sheet } from "~/lib/icons/Sheet";

export default function UserLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: cn('text-secondary'), // Use cn with Tailwind color
        tabBarInactiveTintColor: cn('text-primary'), // Use cn with Tailwind color
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconColor = focused ? cn('text-foreground') : cn('text-primary'); // Use cn with Tailwind color
          switch (route.name) {
            case "playlists/index":
              return <Folder size={24} className={iconColor} />;
            case "medias/[folderId]/index":
              return <Image size={24} className={iconColor} />;
            case "macros/index":
              return <Keyboard size={24} className={iconColor} />;
            case "settings/index":
              return <Settings size={24} className={iconColor} />;
            case "scoreboard/index":
              return <Sheet size={24} className={iconColor} />;
            default:
              return null;
          }
        },
      })}
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
