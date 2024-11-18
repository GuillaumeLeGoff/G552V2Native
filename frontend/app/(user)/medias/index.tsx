import React, { useEffect } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import ActionHeader from "~/components/ActionHeader";
import { CreateButton } from "~/components/createButton";
import { ItemFolder } from "~/components/ItemFolder";
import { ItemMedias } from "~/components/ItemMedias";
import { Header } from "~/components/ui/header";
import { Text } from "~/components/ui/text";
import { useFolder } from "~/hooks/useFolder";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Trash } from "~/lib/icons/Trash";
import { X } from "~/lib/icons/X";
import CreateMediasAndFolderDrawer from "./drawer/@createMediasAndFolder";
import AnimatedScrollView from "~/components/AnimatedScrollView";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media";

function HeaderAction() {
  const { selectedFolder, setSelectFolder, deleteItems, handleBack, folder } =
    useFolder();

  useEffect(() => {
    console.log("folder", folder);
  }, [folder]);

  return (
    <>
      {selectedFolder && selectedFolder.length > 0 ? (
        <ActionHeader
          text={`${selectedFolder.length} sélectionné(s)`}
          actionsBeforeText={[
            {
              icon: X,
              onPress: () => setSelectFolder([]),
              size: 24,
            },
          ]}
          actionsAfterText={[
            {
              icon: Trash,
              onPress: () => deleteItems(selectedFolder),
              size: 20,
            },
          ]}
        />
      ) : (
        <Header
          title={`Medias`}
          onIconPress={handleBack} // Utilisation de handleBackPress
        />
      )}
      <View className="flex-1 flex-row items-center gap-2">
        <TouchableOpacity
          onPress={handleBack}
          style={{ opacity: folder?.parent_id ? 1 : 0 }}
        >
          <ArrowLeft size={24} className="text-primary mr-2" />
        </TouchableOpacity>

        {folder?.path?.split("/").map((part: string, index: number) => (
          <React.Fragment key={index}>
            <Text
              className={
                index === (folder?.path?.split("/")?.length || 0) - 1
                  ? "text-secondary-foreground font-bold"
                  : "text-primary"
              }
            >
              {part}
            </Text>
            {index < (folder?.path?.split("/")?.length || 0) - 1 &&
              selectedFolder?.length < 1 && (
                <ChevronRight size={20} className="mx-1 text-primary" />
              )}
          </React.Fragment>
        ))}
      </View>
    </>
  );
}

function MediasScreen() {
  const {
    folder,
    handleSelect,
    selectedFolder,
    handleFolderPress,
    handleMediaPress,
  } = useFolder();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <AnimatedScrollView>
        <HeaderAction />
        <View className="flex-row flex-wrap">
          {folder?.subFolders?.map((subFolder: Folder, index: number) => (
            <View key={index} style={{ width: "50%", padding: 8 }}>
              <ItemFolder
                title={subFolder.name}
                selectMode={selectedFolder?.length > 0}
                onPress={() => {
                  if (selectedFolder && selectedFolder.length > 0) {
                    handleSelect(subFolder);
                  } else {
                    handleFolderPress(subFolder);
                  }
                }}
                onLongPress={() => handleSelect(subFolder)}
                isSelected={selectedFolder?.some(
                  (item: Folder | Media) => item.id === subFolder.id
                )}
              />
            </View>
          ))}
        </View>
        <View className="flex-row flex-wrap">
          {folder?.media?.map((media: Media, index: number) => (
            <View key={index} style={{ width: "50%", padding: 8 }}>
              <ItemMedias
                selectMode={selectedFolder?.length > 0}
                media={media}
                onPress={() => {
                  if (selectedFolder && selectedFolder.length > 0) {
                    handleSelect(media);
                  } else {
                    handleMediaPress(media);
                  }
                }}
                onLongPress={() => handleSelect(media)}
                isSelected={selectedFolder?.some(
                  (item: Folder | Media) => item.id === media.id
                )}
              />
            </View>
          ))}
        </View>
        {selectedFolder?.length < 1 && (
          <CreateButton className="mt-4" onPress={() => setIsOpen(true)} />
        )}
      </AnimatedScrollView>
      <CreateMediasAndFolderDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default MediasScreen;
