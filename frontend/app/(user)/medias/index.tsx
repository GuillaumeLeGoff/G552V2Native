import React from "react";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import { CreateButton } from "~/components/createButton";
import { ItemFolder } from "~/components/ItemFolder";
import { Header } from "~/components/ui/header";
import { useFolder } from "~/hooks/useFolder";
import CreateMediasAndFolderDrawer from "./drawer/@createMediasAndFolder";

import ActionHeader from "~/components/ActionHeader";
import { Text } from "~/components/ui/text";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Trash } from "~/lib/icons/Trash";
import { X } from "~/lib/icons/X";
import { useAuth } from "~/hooks/useAuth";
import { ItemMedias } from "~/components/ItemMedias";

function HeaderAction() {
  const { selectedItems, setSelectItems, deleteItems, handleBack, folder } =
    useFolder();

  const handleBackPress = () => {
    handleBack();
  };

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
          onIconPress={handleBackPress} // Utilisation de handleBackPress
        />
      )}

      <View className="flex-1 flex-row items-center gap-2">
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ opacity: folder?.parent_id ? 1 : 0 }}
        >
          <ArrowLeft size={24} className="text-primary " />
        </TouchableOpacity>
        <Text className="text-primary">{folder?.path}</Text>
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
  } = useFolder();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View className="flex-1">
      <Animated.ScrollView className="px-8 py-8" scrollEventThrottle={16}>
        <HeaderAction />
        <View className="flex-row flex-wrap">
          {folder?.subFolders?.map((subFolder, index) => (
            <View key={index} style={{ width: "50%", padding: 8 }}>
              <ItemFolder
                title={subFolder.name}
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
          {folder?.media?.map((media, index) => (
            <View key={index} style={{ width: "50%", padding: 8 }}>
              <ItemMedias
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
                  (item) => item.id === media.id && item.type === "media"
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
    </View>
  );
}

export default MediasScreen;
