import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cn } from "~/lib/utils";

interface HeaderProps {
  title: string;
  icon?: React.ReactNode;
  onIconPress?: () => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, icon, onIconPress, className }) => {
  return (
    <View className={cn("flex flex-row items-center justify-between z-50 ", className)}>
      <Text
        className="font-avenir-heavy text-primary text-4xl font-bold"
        style={{ width: 200 }}
      >
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
