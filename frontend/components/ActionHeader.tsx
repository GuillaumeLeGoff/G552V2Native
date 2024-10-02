import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ActionHeaderProps {
  text: string;
  actionsBeforeText?: Array<{
    icon: React.ElementType;
    onPress: () => void;
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  actionsAfterText?: Array<{
    icon: React.ElementType;
    onPress: () => void;
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({
  text,
  actionsBeforeText = [],
  actionsAfterText = [],
}) => {
  return (
    <View className="flex flex-row items-start justify-between z-50">
      {actionsBeforeText.map((action, index) => (
        <TouchableOpacity
          key={index}
          className={`pt-1 ${
            index !== actionsBeforeText.length - 1 ? "pr-2" : ""
          }`}
          onPress={action.onPress}
        >
          <action.icon
            size={action.size || 24}
            strokeWidth={action.strokeWidth || 3}
            className={action.className || "text-primary"}
          />
        </TouchableOpacity>
      ))}
      <View className="flex-1">
        <Text
          className="font-avenir-heavy text-primary text-2xl font-bold"
          style={{ width: 200 }}
        >
          {text}
        </Text>
      </View>
      {actionsAfterText.map((action, index) => (
        <TouchableOpacity
          key={index}
          className={`pt-1  ${
            index !== actionsAfterText.length - 1 ? "pl-2" : ""
          }`}
          onPress={action.onPress}
        >
          <action.icon
            size={action.size || 24}
            strokeWidth={action.strokeWidth || 3}
            className={action.className || "text-primary"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ActionHeader;
