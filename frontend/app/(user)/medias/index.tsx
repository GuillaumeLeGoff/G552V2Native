import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { CreateButton } from "~/components/createButton";
import { ItemFolder } from "~/components/ItemFolder";
import { Header } from "~/components/ui/header";
import { useFolder } from "~/hooks/useFolder";
import CreateMediasAndFolderDrawer from "./drawer/@createMediasAndFolder";

import ActionHeader from "~/components/ActionHeader";
import { Trash } from "~/lib/icons/Trash";
import { X } from "~/lib/icons/X";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Text } from "~/components/ui/text";

function HeaderAction() {
  const {
    selectedFolder,
    setSelectFolder,
    deleteFolders,
    currentFolderId,
    setCurrentFolderId,
    getFolderPath,
    folders,
  } = useFolder();

  const handleBackPress = () => {
    if (currentFolderId) {
      const currentFolder = folders.find((f) => f.id === currentFolderId);
      if (currentFolder?.parent_id !== null) {
        setCurrentFolderId(currentFolder?.parent_id || null);
      }
    }
  };

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
              onPress: () => deleteFolders(selectedFolder),
              size: 20,
            },
          ]}
        />
      ) : (
        <Header
          title={`Medias `}
          onIconPress={() => {
            if (currentFolderId) {
              setCurrentFolderId(null);
            } else {
              console.log("ChevronDown pressed");
            }
          }}
        />
      )}
      {getFolderPath() !== "Home" ? (
        <View className="flex-1 flex-row items-center gap-2">
          <TouchableOpacity onPress={handleBackPress}>
            <ArrowLeft size={24} className="text-primary" />
          </TouchableOpacity>
          <Text className="text-primary">{getFolderPath()}</Text>
        </View>
      ) : null}
    </>
  );
}

function MediasScreen() {
  const {
    folders,
    handleItemLongPress,
    selectedFolder,
    currentFolderId,
    setCurrentFolderId,
    handleItemPress,
  } = useFolder();
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredFolders = folders.filter(
    (folder) => folder.parent_id === currentFolderId
  );

  return (
    <View className="flex-1">
      <Animated.ScrollView className="px-8 py-8" scrollEventThrottle={16}>
        <HeaderAction />
        <View className="flex-row flex-wrap">
          {filteredFolders?.map((folder, index) => (
            <View key={index} style={{ width: "50%", padding: 8 }}>
              <ItemFolder
                title={folder.name}
                onPress={() => {
                  if (selectedFolder && selectedFolder.length > 0) {
                    handleItemLongPress(folder);
                  } else {
                    handleItemPress(folder);
                    setCurrentFolderId(folder.id);
                  }
                }}
                onLongPress={() => handleItemLongPress(folder)}
                isSelected={selectedFolder?.some((f) => f.id === folder.id)}
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
