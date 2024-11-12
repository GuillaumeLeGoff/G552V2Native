import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Modal } from "react-native";
import ActionHeader from "~/components/ActionHeader";
import { Drawer } from "~/components/drawer";
import { ItemMediasPlaylist } from "~/components/ItemMediasPlaylist";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { usePlaylistStore } from "~/store/playlistStore";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function PlaylistCopy() {
  const [isOpen, setIsOpen] = useState(false);
  const { playlist } = usePlaylistStore();
  const [list, setList] = useState(playlist?.medias);
  const pan = Gesture.Pan()
    .onStart(() => {
      console.log("start");
    })
    .onUpdate((event) => {
      console.log("update", event);
    });
  return (
    <Modal className="flex-1 justify-center items-center">
      <GestureDetector gesture={pan}>
        <HeaderAction />
      </GestureDetector>
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
