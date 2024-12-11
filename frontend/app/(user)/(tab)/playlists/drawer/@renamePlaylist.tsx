import React, { useState } from "react";
import { View } from "react-native";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer
} from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { usePlaylists } from "~/hooks/usePlaylists";
import { usePlaylistStore } from "~/store/playlistStore";
import { Playlist } from "~/types/Playlist";

export default function RenamePlaylist() {
  const { handleRenamePlaylist } = usePlaylists();
  const [playlistName, setPlaylistName] = useState("");
  const { onClose } = useDrawer();
  const { playlist } = usePlaylistStore();



  return (
    <DrawerContent>
      <View>
        <DrawerHeader>
          <DrawerTitle>Rename playlist</DrawerTitle>
          <DrawerDescription>Enter the new name of the playlist</DrawerDescription>
        </DrawerHeader>

        <View className="p-4 px-8 ">
          <Input
            className="w-full"
            placeholder="name"
            value={playlistName}
            onChangeText={setPlaylistName}
          />
        </View>

        <DrawerFooter>
          <View className="flex-row justify-end">
            <Button
              className="mt-4 bg-secondary"
              onPress={() => {
                if (playlist) {
                  handleRenamePlaylist(playlist, playlistName);
                }
                onClose();
              }}
              disabled={!playlistName}
            >
              <Text className="text-secondary-foreground">Rename</Text>
            </Button>
          </View>
        </DrawerFooter>
      </View>
    </DrawerContent>
  );
}
