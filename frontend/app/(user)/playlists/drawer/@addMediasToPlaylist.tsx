import React from "react";
import { TouchableOpacity, View } from "react-native";
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
export default function AddMediasToPlaylist() {
  const { folder, handleItemSelect, selectedItems, handleItemFolderPress } =
    useFolder();

  const { addMediasToPlaylist } = usePlaylists();
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Add medias to playlist</DrawerTitle>
      </DrawerHeader>
      <HeaderAction />
      <View className="flex-row flex-wrap">
        {folder?.subFolders?.map((subFolder, index) => (
          <View key={index} style={{ width: "50%", padding: 8 }}>
            <ItemFolder
              title={subFolder.name}
              selectMode={false}
              onPress={() => {
                handleItemFolderPress(subFolder);
              }}
              isSelected={selectedItems?.some(
                (item) => item.id === subFolder.id && item.type === "folder"
              )}
            />
          </View>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {folder?.media?.map((media, index) => (
          <View key={index} style={{ width: "50%", padding: 8 }}>
            <ItemMedias
              selectMode={selectedItems?.length > 0}
              media={media}
              onPress={() => {
                handleItemSelect(media);
              }}
              onLongPress={() => handleItemSelect(media)}
              isSelected={selectedItems?.some((item) => item.id === media.id)}
            />
          </View>
        ))}
      </View>

      <DrawerFooter>
        <View className="flex-row justify-end">
          <Button
            className="mt-4 bg-secondary"
            onPress={() => {
              addMediasToPlaylist();
            }}
          >
            <Text className="text-secondary-foreground">Add</Text>
          </Button>
        </View>
      </DrawerFooter>
    </DrawerContent>
  );
}

function HeaderAction() {
  const { selectedItems, handleBack, folder } = useFolder();
  return (
    <>
      {selectedItems && selectedItems.length > 0 && (
        <ActionHeader text={`${selectedItems.length} sélectionné(s)`} />
      )}

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
