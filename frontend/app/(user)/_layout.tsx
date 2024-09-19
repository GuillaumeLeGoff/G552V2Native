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
        tabBarActiveTintColor: "#D06C6C",
        tabBarInactiveTintColor: "#3D3636",
        tabBarActiveBackgroundColor: "#E9CCCB",
        tabBarIconStyle: {
          color: "red",
        },
        headerShown: false,
        tabBarItemStyle: {
          paddingTop: 5,
          paddingBottom: 5,
          borderRadius: 18,
          marginLeft: 10,
          marginRight: 10,
        },
        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          fontFamily: "Avenir-Heavy",
        },
        tabBarIcon: ({ focused }) => {
          let iconColor = focused
            ? cn("text-secondary-foreground")
            : cn("text-primary"); // Use cn with Tailwind color
          switch (route.name) {
            case "playlists":
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
        name="playlists"
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
