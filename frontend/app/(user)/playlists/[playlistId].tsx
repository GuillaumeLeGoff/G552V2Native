import { router } from "expo-router";
import { View } from "lucide-react-native";
import { Animated, Modal } from "react-native";
import ActionHeader from "~/components/ActionHeader";
import { usePlaylistStore } from "~/store/playlistStore";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { useEffect, useState } from "react";
import { CreateButton } from "~/components/createButton";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import { Drawer } from "~/components/drawer";

export default function Playlist() {
  const [isOpen, setIsOpen] = useState(false);
  const { playlist } = usePlaylistStore();
  useEffect(() => {
    console.log("playlist", playlist);
  }, [playlist]);
  return (
    <Modal className="flex-1 justify-center items-center">
      <HeaderAction />
      <CreateButton
        className="mt-4"
        onPress={() => {
          setIsOpen(true);
        }}
      />
      <View className="flex-1">
        <Animated.ScrollView
          className="px-8 py-8 space-y-4"
          scrollEventThrottle={16}
        >
          <View>
            {/*  {playlists &&
              playlists.length > 0 &&
              playlists.map((item) => (
                <ItemPlaylist
                  key={item.id}
                  title={item.name}
                  onPress={() => {
                    selectedPlaylist && selectedPlaylist.length > 0
                      ? handleItemLongPress(item)
                      : handleItemPress(item);
                  }}
                  onLongPress={() => handleItemLongPress(item)}
                  isSelected={selectedPlaylist?.some((p) => p.id === item.id)}
                />
              ))} */}
            <CreateButton
              className="mt-4"
              onPress={() => {
                console.log("create");
              }}
            />
          </View>
        </Animated.ScrollView>
      </View>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AddMediasToPlaylist />
      </Drawer>
    </Modal>
  );
}

function HeaderAction() {
  const { playlist } = usePlaylistStore();
  return (
    <>
      <ActionHeader
        text={playlist?.name || ""}
        actionsBeforeText={[
          {
            icon: ArrowLeft,
            onPress: () => router.back(),
            size: 24,
          },
        ]}
        /*  actionsAfterText={[
          {
            icon: Trash,
            onPress: () => deletePlaylists(selectedPlaylist),
            size: 20,
          },
        ]} */
      />
    </>
  );
}
