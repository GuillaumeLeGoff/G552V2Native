import React from "react";
import { TouchableOpacity, View } from "react-native";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";

interface ActionHeaderProps {
  text: string;
  className?: string;
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
    dropDown?: Array<{
      name: string;
      onPress: () => void;
      icon: React.ElementType;
    }>;
  }>;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({
  text,
  actionsBeforeText = [],
  actionsAfterText = [],
  className,
}) => {
  return (
    <View
      className={`flex flex-row items-start justify-between z-50 pt-8 ${className}`}
    >
      {actionsBeforeText.map((action, index) => (
        <TouchableOpacity
          key={index}
          className={`pt-1 ${
            index !== actionsBeforeText.length - 1 ? "pr-4" : ""
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
          className="font-avenir-heavy text-primary text-2xl font-bold pl-2"
          style={{ width: 200 }}
        >
          {text}
        </Text>
      </View>
      {actionsAfterText.map((action, index) =>
        action.dropDown ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              {action.dropDown?.map((item, index) => (
                <DropdownMenuItem onPress={item.onPress}>
                  <Text>{item.name}</Text>
                  <DropdownMenuShortcut>
                    <item.icon
                      size={16}
                      strokeWidth={2.5}
                      className={"text-primary-foreground"}
                    />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
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
        )
      )}
    </View>
  );
};

export default ActionHeader;
