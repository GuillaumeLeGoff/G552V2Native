import React from "react";
import { View } from "react-native";
import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer,
} from "~/components/drawer";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useFolder } from "~/hooks/useFolder";

export default function SortMedias() {
  const { sortFolder, handleSortFolder } = useFolder();
  const { onClose } = useDrawer();
  return (
    <DrawerContent>
      <View>
        <DrawerHeader>
          <DrawerTitle>Sort by</DrawerTitle>
        </DrawerHeader>
        <View className="p-4 px-8 gap-4 ">
          <RadioGroup
            value={sortFolder}
            onValueChange={(value) => {
              handleSortFolder(
                value as "aToZ" | "zToA" | "dateNew" | "dateOld"
              );
              onClose();
            }}
          >
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="aToZ" aria-labelledby="label-for-aToZ" />
              <Label
                nativeID="label-for-aToZ"
                onPress={() => {
                  handleSortFolder("aToZ");
                  onClose();
                }}
              >
                A to Z
              </Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="zToA" aria-labelledby="label-for-zToA" />
              <Label
                nativeID="label-for-zToA"
                onPress={() => {
                  handleSortFolder("zToA");
                  onClose();
                }}
              >
                Z to A
              </Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem
                value="dateNew"
                aria-labelledby="label-for-dateNew"
              />
              <Label
                nativeID="label-for-dateNew"
                onPress={() => {
                  handleSortFolder("dateNew");
                  onClose();
                }}
              >
                Date Newest
              </Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem
                value="dateOld"
                aria-labelledby="label-for-dateOld"
              />
              <Label
                nativeID="label-for-dateOld"
                onPress={() => {
                  handleSortFolder("dateOld");
                  onClose();
                }}
              >
                Date Oldest
              </Label>
            </View>
          </RadioGroup>
        </View>

        <DrawerFooter>
          <View className="flex-row justify-end"></View>
        </DrawerFooter>
      </View>
    </DrawerContent>
  );
}
