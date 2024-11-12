import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Play } from "~/lib/icons/Play";
import { User } from "../types/User";

interface ItemPlaylist {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export function ItemPlaylist({
  title,
  onPress,
  onLongPress,
  isSelected,
  ...props
}: ItemPlaylist) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      onLongPress={onLongPress}
      className={`flex-row items-center justify-between mb-2 mt-6 p-12 rounded-lg shadow-sm ${
        isSelected ? "bg-secondary" : "bg-card"
      }`}
      {...props}
    >
      <Text
        className={`text-lg font-avenir-black ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
      >
        {title}
      </Text>
      <View className="bg-secondary rounded-full p-2">
        <Play
          size={20}
          strokeWidth={2.5}
          className="text-secondary-foreground"
        />
      </View>
    </TouchableOpacity>
  );
}
