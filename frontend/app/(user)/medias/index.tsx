import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef } from "react";
import { Platform, SectionList, TouchableOpacity, View } from "react-native";
import ActionHeader from "~/components/ActionHeader";
import FloatingActionMenu from "~/components/floatingMenu/FloatingActionMenu";
import { ItemFolder } from "~/components/ItemFolder";
import { ItemMedias } from "~/components/ItemMedias";
import { Header } from "~/components/ui/header";
import { Text } from "~/components/ui/text";
import { useFolder } from "~/hooks/useFolder";
import { useMedia } from "~/hooks/useMedia";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Camera } from "~/lib/icons/Camera";
import { FolderPlus } from "~/lib/icons/FolderPlus";
import { ImagePlus } from "~/lib/icons/ImagePlus";
import { Trash } from "~/lib/icons/Trash";
import { X } from "~/lib/icons/X";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media";
import CreateMediasAndFolderDrawer from "./drawer/@createMediasAndFolder";
import { ChevronRight } from "~/lib/icons/ChevronRight";

function MediasScreen() {
  const {
    folder,
    handleSelect,
    selectedFolder,
    getFolderById,
    handleMediaPress,
  } = useFolder();
  const [isOpen, setIsOpen] = React.useState(false);
  const { uploadMedia } = useMedia();
  const formatData = (data: (Folder | Media)[]) => {
    const numberOfColumns = 2;
    const formattedData = [];
    for (let i = 0; i < (data?.length || 0); i += numberOfColumns) {
      formattedData.push(data.slice(i, i + numberOfColumns));
    }
    return formattedData;
  };

  const sections = [
    { data: formatData(folder?.subFolders || []) },
    { data: formatData(folder?.media || []) },
  ];

  const menuRef = useRef<any>(null);

  const pickImage = async () => {
    try {
      menuRef.current?.closeMenu();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Modification : autorise les images et vidéos
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const { uri, type: assetType } = asset;

        const filename = asset.fileName || uri.split("/").pop() || "media";

        let type;
        const match = /\.(\w+)$/.exec(filename);
        if (match) {
          const extension = match[1].toLowerCase();
          if (["mp4", "mov", "avi"].includes(extension)) {
            type = `video/${extension}`;
          } else {
            type = `image/${match[1]}`;
          }
        } else {
          type = assetType || "application/octet-stream";
        }

        const formData = new FormData();

        if (Platform.OS === "web") {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append("file", blob, filename);
        } else {
          formData.append("file", {
            uri,
            name: filename,
            type,
            folderId: folder?.id,
          } as any);
        }
        formData.append("folderId", folder?.id.toString() || "");
        await uploadMedia(formData);
      }
    } catch (error) {
      console.error("Error picking or uploading media:", error);
    }
  };

  const takePhoto = async () => {
    try {
      menuRef.current?.closeMenu();
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Modification : autorise les photos et vidéos
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const { uri, type: assetType } = asset;

        const filename = asset.fileName || uri.split("/").pop() || "media";

        let type;
        const match = /\.(\w+)$/.exec(filename);
        if (match) {
          const extension = match[1].toLowerCase();
          if (["mp4", "mov", "avi"].includes(extension)) {
            type = `video/${extension}`;
          } else {
            type = `image/${match[1]}`;
          }
        } else {
          type = assetType || "application/octet-stream";
        }

        const formData = new FormData();

        if (Platform.OS === "web") {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append("file", blob, filename);
        } else {
          formData.append("file", {
            uri,
            name: filename,
            type,
            folderId: folder?.id,
          } as any);
        }
        formData.append("folderId", folder?.id.toString() || "");
        await uploadMedia(formData);
      }
    } catch (error) {
      console.error("Error taking or uploading media:", error);
    }
  };

  useEffect(() => {
    const requestMediaLibraryPermissions = async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
        }
      }
    };

    requestMediaLibraryPermissions();
  }, []);

  const secondaryButtons = [
    {
      icon: <ImagePlus size={24} className="text-secondary-foreground" />,
      onPress: pickImage,
    },
    {
      icon: <FolderPlus size={24} className="text-secondary-foreground" />,
      onPress: () => {
        setIsOpen(true);
        menuRef.current?.closeMenu();
      },
    },
    {
      icon: <Camera size={24} className="text-secondary-foreground" />,
      onPress: takePhoto,
    },
  ];
  return (
    <>
      <SectionList
        className="px-8 pb-8"
        sections={sections}
        keyExtractor={(item, index) =>
          (item[0]?.id || item[1]?.id).toString() + index
        }
        ListHeaderComponent={<HeaderAction />}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            {item.map((subItem) => (
              <View key={subItem.id} style={{ width: "48%" }}>
                {"name" in subItem ? (
                  <ItemFolder
                    title={subItem.name}
                    selectMode={selectedFolder?.length > 0}
                    onPress={() => {
                      if (selectedFolder && selectedFolder.length > 0) {
                        handleSelect(subItem);
                      } else {
                        getFolderById(subItem.id);
                      }
                    }}
                    onLongPress={() => handleSelect(subItem)}
                    isSelected={selectedFolder?.some(
                      (selected) => selected.id === subItem.id
                    )}
                  />
                ) : (
                  <ItemMedias
                    selectMode={selectedFolder?.length > 0}
                    media={subItem as Media}
                    onPress={() => {
                      if (selectedFolder && selectedFolder.length > 0) {
                        handleSelect(subItem as Media);
                      } else {
                        handleMediaPress(subItem as Media);
                      }
                    }}
                    onLongPress={() => handleSelect(subItem as Media)}
                    isSelected={selectedFolder?.some(
                      (selected) => selected.id === subItem.id
                    )}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      />
      {selectedFolder && selectedFolder.length <= 0 && (
        <FloatingActionMenu ref={menuRef} secondaryButtons={secondaryButtons} />
      )}
      <CreateMediasAndFolderDrawer
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}

function HeaderAction() {
  const { selectedFolder, setSelectFolder, deleteItems, handleBack, folder } =
    useFolder();

  return (
    <>
      {selectedFolder && selectedFolder.length > 0 ? (
        <ActionHeader
          className="mb-2"
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
      <View className="flex-row items-center gap-2 py-4">
        <TouchableOpacity
          onPress={handleBack}
          style={{ opacity: folder?.parent_id ? 1 : 0 }}
        >
          <ArrowLeft size={24} className="text-primary mr-2" />
        </TouchableOpacity>
        {/* <Text className="text-primary">{folder?.path}</Text> */}
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

export default MediasScreen;
