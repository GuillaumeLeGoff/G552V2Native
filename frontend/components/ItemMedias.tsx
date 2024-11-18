import { Image, TouchableOpacity, View, Text } from "react-native";
import { Circle } from "~/lib/icons/Circle";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { Media } from "~/types/Media";
import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { useAuth } from "~/hooks/useAuth";

interface ItemMedias {
  media: Media;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  selectMode?: boolean;
}

export function ItemMedias({
  onPress,
  onLongPress,
  isSelected,
  media,
  selectMode,
}: ItemMedias) {
  const { user } = useAuth();
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      {selectMode && (
        <View className="absolute top-3 left-7 " style={{ zIndex: 2 }}>
          {isSelected ? (
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
          )}
        </View>
      )}
      {isSelected && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 border-3 border-secondary-foreground rounded-lg"
          style={{ zIndex: 1 }}
        >
          <View
            style={{ opacity: 0.8 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-secondary rounded-lg"
          />
        </View>
      )}
      {media.type.includes("image") && (
        <Image
          className="rounded-lg"
          source={{
            uri: `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/uploads/${user}/${media.file_name}`,
          }}
          style={{ width: "100%", height: (250 * 9) / 16 }} // Ajuste la hauteur pour un ratio 16:9
        />
      )}
      {media.type.includes("video") && (
        <>
          <Image
            className="rounded-lg"
            source={{
              uri: `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/uploads/${user}/${media.thumbnail_name}`,
            }}
            style={{ width: "100%", height: (250 * 9) / 16 }} // Ajuste la hauteur pour un ratio 16:9
          />
          <Text className="absolute bottom-2 right-4 text-white bg-black bg-opacity-50 px-1 rounded opacity-70">
            {media.duration}s
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
