import React from "react";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function ChangePlaylistMediasTime({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [duration, setDuration] = React.useState(0);

  const handleSave = () => {
    /*    onChangeDuration(duration);
    onClose(); */
  };

  return (
    <DrawerContent>
      <View className="p-4 px-8"></View>
    </DrawerContent>
  );
}
