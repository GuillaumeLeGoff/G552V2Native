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
  text?: string;
  title?: string;
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
    text?: string;
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
  title,
  actionsBeforeText = [],
  actionsAfterText = [],
  className,
}) => {
  return (
    <View
      className={`flex flex-row  justify-between items-center z-50 pt-8 ${className}`}
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
          className={`font-avenir-heavy text-primary font-bold pl-2 ${
            title ? "text-4xl" : "text-2xl"
          }`}
          style={{ width: 200 }}
        >
          {title || text}
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
                <View className="flex-row items-center">
                  {action.text ? (
                    <Text className=" font-avenir-heavy text-primary">
                      {action.text}
                    </Text>
                  ) : null}
                  <action.icon
                    size={action.size || 24}
                    strokeWidth={action.strokeWidth || 3}
                    className={action.className || "text-primary"}
                  />
                </View>
              </TouchableOpacity>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              {action.dropDown?.map((item, index) => (
                <DropdownMenuItem key={index} onPress={item.onPress}>
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
            } flex-row items-center`}
            onPress={action.onPress}
          >
            {action.text ? (
              <Text className=" font-avenir-heavy text-primary">
                {action.text}
              </Text>
            ) : null}
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
