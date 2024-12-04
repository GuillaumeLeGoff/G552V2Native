import React, { useState } from "react";
import { View } from "react-native";
import {
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer
} from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { usePlaylists } from "~/hooks/usePlaylists";
import { usePlaylistStore } from "~/store/playlistStore";
import { Playlist } from "~/types/Playlist";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from '~/components/ui/label';

export default function SortPlaylist() {

  const { sortBy, handleSortPlaylist } = usePlaylists();
  const {onClose} = useDrawer()
  return (
    <DrawerContent>
      <View>
        <DrawerHeader>
          <DrawerTitle>Sort playlist</DrawerTitle>
         
        </DrawerHeader>
        <View className="p-4 px-8 gap-4 ">
          <RadioGroup value={sortBy} onValueChange={(value) => {handleSortPlaylist(value as "aToZ" | "zToA" | "dateNew" | "dateOld"); onClose()}}>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="aToZ" aria-labelledby="label-for-aToZ" />
              <Label nativeID="label-for-aToZ" onPress={() => {handleSortPlaylist("aToZ"); onClose()}}>A to Z</Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="zToA" aria-labelledby="label-for-zToA" />
              <Label nativeID="label-for-zToA" onPress={() => {handleSortPlaylist("zToA"); onClose()}}>Z to A</Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="dateNew" aria-labelledby="label-for-dateNew" />
              <Label nativeID="label-for-dateNew" onPress={() => {handleSortPlaylist("dateNew"); onClose()}}>Date Newest</Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="dateOld" aria-labelledby="label-for-dateOld" />
              <Label nativeID="label-for-dateOld" onPress={() => {handleSortPlaylist("dateOld"); onClose()}}>Date Oldest</Label>
            </View>
          </RadioGroup>
        </View>

        <DrawerFooter>
          <View className="flex-row justify-end">
           
          </View>
        </DrawerFooter>
      </View>
    </DrawerContent>
  );
}
