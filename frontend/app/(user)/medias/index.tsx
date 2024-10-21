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

function HeaderAction() {
  const { selectedItems, setSelectItems, deleteItems, handleBack, folder } =
    useFolder();

  return (
    <>
      {selectedItems && selectedItems.length > 0 ? (
        <ActionHeader
          text={`${selectedItems.length} sélectionné(s)`}
          actionsBeforeText={[
            {
              icon: X,
              onPress: () => setSelectItems([]),
              size: 24,
            },
          ]}
          actionsAfterText={[
            {
              icon: Trash,
              onPress: () => deleteItems(selectedItems),
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
        {folder?.path?.split("/").map((part, index) => (
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
            {index < (folder?.path?.split("/")?.length || 0) - 1 && (
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
    handleItemSelect,
    selectedItems,
    handleItemFolderPress,
    handleItemMediaPress,
    getRootFolder,
  } = useFolder();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    getRootFolder();
  }, []);

  return (
    <>
      <Animated.ScrollView>
        <HeaderAction />
        <View className="flex-row flex-wrap">
          {folder?.subFolders?.map((subFolder, index) => (
            <View key={index} style={{ width: "50%", padding: 8 }}>
              <ItemFolder
                title={subFolder.name}
                selectMode={selectedItems?.length > 0}
                onPress={() => {
                  if (selectedItems && selectedItems.length > 0) {
                    handleItemSelect(subFolder);
                  } else {
                    handleItemFolderPress(subFolder);
                  }
                }}
                onLongPress={() => handleItemSelect(subFolder)}
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
                  if (selectedItems && selectedItems.length > 0) {
                    handleItemSelect(media);
                  } else {
                    handleItemMediaPress(media);
                  }
                }}
                onLongPress={() => handleItemSelect(media)}
                isSelected={selectedItems?.some(
                  (item) =>
                    item.id === media.id &&
                    item.type === "image" ||
                    item.type === "video"
                )}
              />
            </View>
          ))}
        </View>
        <CreateButton className="mt-4" onPress={() => setIsOpen(true)} />
      </Animated.ScrollView>
      <CreateMediasAndFolderDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default MediasScreen;
