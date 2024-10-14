import { Image, Text, TouchableOpacity } from "react-native";
import { useAuth } from "~/hooks/useAuth";
import { Folder } from "~/lib/icons/Folder";
import { Media } from "~/types/Media";

interface ItemMedias {
  media: Media;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export function ItemMedias({
  onPress,
  onLongPress,
  isSelected,
  media,
}: ItemMedias) {
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
      <Image
        source={{
          uri: `http://192.168.1.78:4000/uploads/admin/${media.file_name}`,
        }}
        style={{ width: 150, height: 150 }}
      />
      <Text
        className={`self-center text-lg ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
      >
        {media.original_file_name}
      </Text>
    </TouchableOpacity>
  );
}
