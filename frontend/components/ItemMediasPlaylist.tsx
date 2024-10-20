import { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Circle } from "~/lib/icons/Circle";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { Media } from "~/types/Media";

interface ItemMediasPlaylist {
  media: any;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  selectMode?: boolean;
}

export function ItemMediasPlaylist({
  onPress,
  onLongPress,
  isSelected,
  media,
  selectMode,
}: ItemMediasPlaylist) {
  useEffect(() => {
    console.log("ItemMediasPlaylist", media);
  }, [media]);
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      className={`items-center rounded-lg shadow-sm pl-8 p-6 flex-row bg-secondary `}
      style={{ flex: 1 }}
    >
      <Image
        className="rounded-lg"
        source={{
          uri: `http://192.168.1.78:4000/uploads/admin/${media.media.file_name}`,
        }}
        style={{ width: "50%", height: (250 * 9) / 16 }} // Ajuste la hauteur pour un ratio 16:9
      />
    </TouchableOpacity>
  );
}
