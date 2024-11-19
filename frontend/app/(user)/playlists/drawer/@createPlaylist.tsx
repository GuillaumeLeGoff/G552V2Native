import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer,
} from "~/components/drawer";
import { usePlaylists } from "~/hooks/usePlaylists";

export default function CreatePlaylist() {
  const { createPlaylist } = usePlaylists();
  const [playlistName, setPlaylistName] = useState("");
  const { onClose } = useDrawer();

  const handleCreatePlaylist = () => {
    createPlaylist(playlistName);
    onClose(); // Fermer le tiroir après la création de la playlist
  };

  return (
    <DrawerContent>
      <View>
        <DrawerHeader>
          <DrawerTitle>Create a new playlist</DrawerTitle>
          <DrawerDescription>
            Enter the name of the new playlist
          </DrawerDescription>
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
              onPress={() => handleCreatePlaylist()}
              disabled={!playlistName}
            >
              <Text className="text-secondary-foreground">Create</Text>
            </Button>
          </View>
        </DrawerFooter>
      </View>
    </DrawerContent>
  );
}
