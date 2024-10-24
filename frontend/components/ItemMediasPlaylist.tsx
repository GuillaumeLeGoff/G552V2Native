import { useEffect } from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { Circle } from "~/lib/icons/Circle";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { Media } from "~/types/Media";
import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { useAuth } from "~/hooks/useAuth";
import { GripHorizontal } from "lucide-react-native";
import { Input } from "./ui/input";

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
  const { user } = useAuth();
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
      <GripHorizontal size={24} className="mr-2 text-primary" />
      {media.media.type.includes("image") && (
        <Image
          className="rounded-lg"
          source={{
            uri: `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/uploads/${user}/${media.media.file_name}`,
          }}
          style={{ width: "50%", height: (250 * 9) / 16 }} // Ajuste la hauteur pour un ratio 16:9
        />
      )}
      {media.media.type.includes("video") && (
        <>
          <Image
            className="rounded-lg"
            source={{
              uri: `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/uploads/${user}/${media.media.thumbnail_name}`,
            }}
            style={{ width: "50%", height: (250 * 9) / 16 }} // Ajuste la hauteur pour un ratio 16:9
          />
          <Text className="absolute bottom-2 right-4 text-white bg-black bg-opacity-50 px-1 rounded opacity-70">
            {media.duration}s
          </Text>
        </>
      )}
      <Input
        placeholder="Nom de la vidéo"
        value={media.media_dur_in_playlist}
        className="flex-1"
      />
    </TouchableOpacity>
  );
}
