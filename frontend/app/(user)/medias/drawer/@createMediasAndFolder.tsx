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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const { uri } = asset;

        const filename = asset.fileName || uri.split("/").pop() || "photo.jpg";

        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

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
      console.error("Error picking or uploading image:", error);
      Alert.alert("Upload Failed", "Failed to upload image");
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
