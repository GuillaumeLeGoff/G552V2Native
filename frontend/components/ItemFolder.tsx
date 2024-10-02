import { Text, TouchableOpacity } from "react-native";
import { Folder } from "~/lib/icons/Folder";

interface ItemFolder {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export function ItemFolder({
  title,
  onPress,
  onLongPress,
  isSelected,
}: ItemFolder) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className={`items-center justify-center rounded-lg shadow-sm p-4 ${
        isSelected ? "bg-secondary" : "bg-card"
      }`}
      style={{ flex: 1 }}
    >
      <Folder
        size={64}
        className={`self-center ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
      />
      <Text
        className={`self-center text-lg ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
