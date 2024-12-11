import React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ActionHeader from "~/components/ActionHeader";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/drawer";
import { ItemFolder } from "~/components/ItemFolder";
import { ItemMedias } from "~/components/ItemMedias";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useFolder } from "~/hooks/useFolder";
import { usePlaylists } from "~/hooks/usePlaylists";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
export default function AddMediasToPlaylist({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { folder, handleSelect, selectedFolder, getFolderById } = useFolder();

  const { addMediasToPlaylist } = usePlaylists();

  const SCREEN_HEIGHT = Dimensions.get("window").height;
  return (
    <DrawerContent>
      <View>
        <DrawerHeader>
          <DrawerTitle>Add medias to playlist</DrawerTitle>
        </DrawerHeader>
        <HeaderAction />
      </View>
      <View style={{ height: SCREEN_HEIGHT * 0.7 }}>
        <ScrollView style={{ flexGrow: 1 }}>
          <View className="flex-row flex-wrap ">
            {folder?.subFolders?.map((subFolder, index) => (
              <View key={index} style={{ width: "50%", padding: 8 }}>
                <ItemFolder
                  title={subFolder.name}
                  selectMode={false}
                  onPress={() => {
                    getFolderById(subFolder.id);
                  }}
                  isSelected={selectedFolder?.some(
                    (item) => item.id === subFolder.id
                  )}
                />
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {folder?.media?.map((media, index) => (
              <View key={index} style={{ width: "50%", padding: 8 }}>
                <ItemMedias
                  selectMode={selectedFolder?.length > 0}
                  media={media}
                  onPress={() => {
                    handleSelect(media);
                  }}
                  onLongPress={() => handleSelect(media)}
                  isSelected={selectedFolder?.some(
                    (item) => item.id === media.id
                  )}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="flex-row justify-end">
          <Button
            disabled={selectedFolder?.length === 0}
            className="mt-4 bg-secondary"
            onPress={() => {
              addMediasToPlaylist();
              setIsOpen(false);
            }}
          >
            <Text className="text-secondary-foreground">Add</Text>
          </Button>
        </View>
      </View>
    </DrawerContent>
  );
}

function HeaderAction() {
  const { selectedFolder, handleBack, folder } = useFolder();
  return (
    <>
      <Text className="text-primary p-4">{`${selectedFolder.length} sélectionné(s)`}</Text>

      <View className="flex-1 flex-row items-center gap-2">
        <TouchableOpacity
          onPress={handleBack}
          style={{ opacity: folder?.parent_id ? 1 : 0 }}
        >
          <ArrowLeft size={24} className="text-primary " />
        </TouchableOpacity>
        <Text className="text-primary">{folder?.path}</Text>
      </View>
    </>
  );
}
