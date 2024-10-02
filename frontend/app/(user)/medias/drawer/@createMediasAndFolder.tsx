import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
import { TextInput } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useFolder } from "~/hooks/useFolder";

interface CreateMediasAndFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMediasAndFolderDrawer: React.FC<
  CreateMediasAndFolderDrawerProps
> = ({ isOpen, onClose }) => {
  const [showInput, setShowInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { createFolder, currentFolderId } = useFolder();

  const closeDrawer = () => {
    setShowInput(false);
    setFolderName("");
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer}>
      <DrawerContent>
        <View className="flex flex-col space-y-4">
          {!showInput ? (
            <>
              <TouchableOpacity
                className="p-4  border-gray-300 gap-2 flex flex-row items-center justify-center"
                onPress={() => console.log("Upload pressed")}
              >
                <Upload size={24} className="mr-2 text-primary" />
                <Text className="font-avenir-book text-lg ">Upload Media</Text>
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

              <View className="p-4 px-8 ">
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
                      createFolder(folderName, currentFolderId);

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
