import React, { useState } from "react";
import { Text, View } from "react-native";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useFolder } from "~/hooks/useFolder";
import { useMedia } from "~/hooks/useMedia";

interface CreateMediasAndFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMediasAndFolderDrawer: React.FC<
  CreateMediasAndFolderDrawerProps
> = ({ isOpen, onClose }) => {
  const [folderName, setFolderName] = useState("");
  const { createFolder, folder } = useFolder();

  const closeDrawer = () => {
    setFolderName("");
    onClose();
  };





  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer}>
      <DrawerContent>
        <View className="flex flex-col space-y-4">
           
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
          
        </View>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateMediasAndFolderDrawer;
