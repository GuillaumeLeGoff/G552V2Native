import { Tabs } from "expo-router";
import { Folder } from "~/lib/icons/Folder";
import { Image } from "~/lib/icons/Image";
import { Keyboard } from "~/lib/icons/Keyboard";
import { Settings } from "~/lib/icons/Settings";
import { Sheet } from "~/lib/icons/Sheet";
import { cn } from "~/lib/utils"; // Import cn

export default function UserLayout() {
  return (
    <>
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
              case "medias":
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
            headerShown: false,
            tabBarLabel: "Playlist",
          }}
        />
        <Tabs.Screen
          name="medias"
          options={{
            tabBarLabel: "Media",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="macros/index"
          options={{
            tabBarLabel: "Macro",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="scoreboard/index"
          options={{
            tabBarLabel: "Scoreboard",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            tabBarLabel: "Setting",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
