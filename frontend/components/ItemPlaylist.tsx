import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Play } from "~/lib/icons/Play";
import { User } from "../types/User";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { Circle } from "~/lib/icons/Circle";

interface ItemPlaylist {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isSelectMode?: boolean;
}

export function ItemPlaylist({
  title,
  onPress,
  onLongPress,
  isSelected,
  isSelectMode,
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
          isSelected ? "text-secondary-foreground" : "text-primary "
        }`}
      >
        {title}
      </Text>
      
      <View className="flex-row items-center">
        <View className={`bg-secondary rounded-full p-2 ${isSelectMode ? "hidden" : " "}`}>
       <Play
          size={20}
          strokeWidth={2.5}
          className="text-secondary-foreground"
          />
        </View>
        {isSelectMode ? (
          isSelected ? (
             <View className=" p-1">
          <CircleCheck
          size={24}
          className={`self-center ${
                isSelected ? "text-secondary-foreground" : "text-primary"
            }`}
          />
          </View>
        ) : (
          <View className=" p-1">
          <Circle
          size={24}
          className={`self-center  ${
                isSelected ? "text-secondary-foreground" : "text-primary"
              }`}
          />
          </View>
        )
      ) : (
        <View />
      )}
      </View>
    </TouchableOpacity>
  );
}
