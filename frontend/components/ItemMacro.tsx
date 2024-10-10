import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { usePlaylists } from "~/hooks/usePlaylists";
import { Macro } from "~/types/Macro";
interface ItemMacro {
  title: string;
  macro: Macro;
}

export function ItemMacro({
  title,
  macro,
}: ItemMacro) {
  const insets = useSafeAreaInsets();
  const { playlists } = usePlaylists();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // Trouver la playlist par défaut
  const defaultPlaylist = playlists.find(
    (playlist) => playlist.id === macro.playlist_id
  );

  return (
    <View
      className={`flex-row items-center justify-between mb-2 mt-6 p-6 rounded-lg shadow-sm 
        bg-card
      `}
    >
      <Text
        className={`text-lg font-avenir-black 
        text-primary 
      `}
      >
        {title}
      </Text>

      <Select  defaultValue={{ value: defaultPlaylist?.id.toString() || '', label: defaultPlaylist?.name || 'Select a playlist' }}
      
       onValueChange={(value) => {
          console.log(value);
        }}
      >
        <SelectTrigger className='w-[250px]'>
          <SelectValue
            className='text-foreground text-sm native:text-lg'
            placeholder='Select a playlist'
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className='w-[250px]'>
          <SelectGroup>
            {playlists &&
              playlists.length > 0 &&
              playlists.map((playlist) => (
                <SelectItem key={playlist.id} label={playlist.name} value={playlist.id.toString()}
               
                >
                  {playlist.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}
