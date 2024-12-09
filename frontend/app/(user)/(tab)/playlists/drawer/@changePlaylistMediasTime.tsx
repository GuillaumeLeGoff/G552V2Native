import React, { useState } from "react";
import { View } from "react-native";
import { WheelPicker } from "react-native-infinite-wheel-picker";

import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePlaylistsMedias } from "~/hooks/usePlaylistsMedias";
export default function ChangePlaylistMediasTime({
  isOpen,
  setIsOpen,
  selectedPlaylistMedia,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedPlaylistMedia: any;
}) {
    const { updatePlaylistMediaTime } = usePlaylistsMedias();
    const [selectedTime, setSelectedTime] = useState(selectedPlaylistMedia?.media_dur_in_playlist || 0);
  const dataSource = Array.from({ length: 100 }, (_, i) => i.toString());



  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Change playlist medias time</DrawerTitle>
      </DrawerHeader>
      <View className="p-4 px-8" style={{ flexGrow: 1 }}>
        <View className="flex-row justify-center items-center">
        <WheelPicker
      initialSelectedIndex={selectedTime}
      selectedIndex={selectedTime}
      data={dataSource}
      onChangeValue={ (index) => setSelectedTime(index) }
      containerStyle={{ width: 60  }}
      selectedLayoutStyle={{
        backgroundColor: "#E9CCCB",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#D06C6C",
      }}
      infiniteScroll={false}
      elementHeight={60}
      elementTextStyle={{
        fontSize: 20,
        color: "#D06C6C",
       
      }}
      restElements={2}
    />
          <Text className="text-center ml-4 text-xl font-avenir-heavy text-secondary-foreground">
            Seconde
          </Text>
        </View>
        <View className="flex-row justify-end">
          <Button
            className="mt-4 bg-secondary"
             onPress={() => {
              console.log(selectedTime);
              updatePlaylistMediaTime(selectedPlaylistMedia, selectedTime);
              setIsOpen(false);
          }}
          >
            <Text className="text-secondary-foreground">Save</Text>
          </Button>
        </View>
      </View>
    </DrawerContent>
  );
}
