import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "~/lib/utils";

interface HeaderProps {
  title: string;
  icon?: React.ReactNode;
  onIconPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, icon, onIconPress }) => {
  return (
    <View className="flex flex-row items-center justify-between p-2 ">
      <Text className=" font-avenir-heavy text-primary flex-1 text-4xl font-bold">
        {title}
      </Text>
      {icon && (
        <TouchableOpacity onPress={onIconPress} className="ml-2">
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export { Header };
