import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
} from "~/components/drawer";
import { Separator } from "~/components/ui/separator";
import { FolderPlus } from "~/lib/icons/FolderPlus";
import { Upload } from "~/lib/icons/Upload";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useFolder } from "~/hooks/useFolder";
import { useMedia } from "~/hooks/useMedia";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
interface CreateMediasAndFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMediasAndFolderDrawer: React.FC<
  CreateMediasAndFolderDrawerProps
> = ({ isOpen, onClose }) => {
  const [showInput, setShowInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { createFolder, folder } = useFolder();
  const { uploadMedia } = useMedia();

  const closeDrawer = () => {
    setShowInput(false);
    setFolderName("");
    onClose();
  };

  useEffect(() => {
    const requestMediaLibraryPermissions = async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissions Required",
            "Sorry, we need media library permissions to make this work!"
          );
        }
      }
    };

    requestMediaLibraryPermissions();
  }, []);

  const pickImage = async () => {
    try {
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

        closeDrawer();
      }
    } catch (error) {
      console.error("Error picking or uploading media:", error);
      Alert.alert("Upload Failed", "Failed to upload media");
    }
  };

  const takePhoto = async () => {
    try {
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

        closeDrawer();
      }
    } catch (error) {
      console.error("Error taking or uploading media:", error);
      Alert.alert("Upload Failed", "Failed to take media");
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer}>
      <DrawerContent>
        <View className="flex flex-col space-y-4">
          {!showInput ? (
            <>
              <TouchableOpacity
                className="p-4 border-gray-300 gap-2 flex flex-row items-center justify-center"
                onPress={pickImage}
              >
                <Upload size={24} className="mr-2 text-primary" />
                <Text className="font-avenir-book text-lg">Upload Media</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="p-4 border-gray-300 gap-2 flex flex-row items-center justify-center"
                onPress={takePhoto}
              >
              
                <Text className="font-avenir-book text-lg">Take Photo</Text>
              </TouchableOpacity>

              <Separator
                orientation="horizontal"
                className="w-[100%] flex items-center justify-center"
              />
              <TouchableOpacity
                className="p-4 border-gray-300 flex flex-row items-center justify-center gap-2"
                onPress={() => setShowInput(true)}
              >
                <FolderPlus size={24} className="mr-2 text-primary" />
                <Text className="font-avenir-book text-lg">Create Folder</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="flex flex-col space-y-2">
              <DrawerHeader>
                <DrawerTitle>Create a new folder</DrawerTitle>
                <DrawerDescription>Enter Name of the folder</DrawerDescription>
              </DrawerHeader>

              <View className="p-4 px-8">
                <Input
                  className="w-full"
                  placeholder="name"
                  value={folderName}
                  onChangeText={setFolderName}
                />
              </View>

              <DrawerFooter>
                <View className="flex-row justify-end">
                  <Button
                    className="mt-4 bg-secondary"
                    onPress={() => {
                      createFolder(folderName, folder?.id || null);
                      closeDrawer();
                    }}
                    disabled={!folderName}
                  >
                    <Text className="text-secondary-foreground">Create</Text>
                  </Button>
                </View>
              </DrawerFooter>
            </View>
          )}
        </View>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateMediasAndFolderDrawer;
