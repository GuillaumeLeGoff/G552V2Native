import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Modal } from "react-native";
import ActionHeader from "~/components/ActionHeader";
import { Drawer } from "~/components/drawer";
import { ItemMediasPlaylist } from "~/components/ItemMediasPlaylist";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { usePlaylistStore } from "~/store/playlistStore";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";

export default function Playlist() {
  const [isOpen, setIsOpen] = useState(false);
  const { playlist } = usePlaylistStore();
  useEffect(() => {
    console.log("playlist", playlist);
  }, [playlist]);
  return (
    <Modal className="flex-1 justify-center items-center">
      <Animated.ScrollView scrollEventThrottle={16}>
        <HeaderAction />
        {playlist?.medias.map((media: any, index: number) => (
          <ItemMediasPlaylist key={media.id} media={media} />
        ))}
      </Animated.ScrollView>
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
