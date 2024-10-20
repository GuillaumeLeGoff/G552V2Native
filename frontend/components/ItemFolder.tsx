import { Text, TouchableOpacity } from "react-native";
import { Folder } from "~/lib/icons/Folder";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { Circle } from "~/lib/icons/Circle";
interface ItemFolder {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  selectMode?: boolean;
}

export function ItemFolder({
  title,
  onPress,
  onLongPress,
  isSelected,
  selectMode,
}: ItemFolder) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className={`items-center rounded-lg shadow-sm pl-8 p-6 flex-row ${
        isSelected ? "bg-secondary" : "bg-card"
      }`}
      style={{ flex: 1 }}
    >
      {selectMode ? (
        isSelected ? (
          <CircleCheck
            size={24}
            className={`self-center ${
              isSelected ? "text-secondary-foreground" : "text-primary"
            }`}
          />
        ) : (
          <Circle
            size={24}
            className={`self-center ${
              isSelected ? "text-secondary-foreground" : "text-primary"
            }`}
          />
        )
      ) : (
        <Folder
          size={24}
          className={`self-center ${
            isSelected ? "text-secondary-foreground" : "text-primary"
          }`}
        />
      )}
      <Text
        className={`flex-1 self-center text-lg text-center ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
        numberOfLines={1} // Limite le texte à une seule ligne
        ellipsizeMode="tail" // Coupe le texte à la fin si trop long
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
