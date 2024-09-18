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
    <View className="flex flex-row items-center justify-between p-4 bg-background">
      <Text className=" font-avenir-heavy text-primary flex-1">{title}</Text>
      {icon && (
        <TouchableOpacity onPress={onIconPress} className="ml-2">
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export { Header };
