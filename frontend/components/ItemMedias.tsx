import { Image, TouchableOpacity, View } from "react-native";
import { Circle } from "~/lib/icons/Circle";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { Media } from "~/types/Media";

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
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      {selectMode && (
        <View className="absolute top-3 left-3 " style={{ zIndex: 2 }}>
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
      <Image
        className="rounded-lg"
        source={{
          uri: `http://192.168.1.78:4000/uploads/admin/${media.file_name}`,
        }}
        style={{ width: "100%", height: (250 * 9) / 16 }} // Ajuste la hauteur pour un ratio 16:9
      />
      {/* <Text
        className={`self-center text-lg ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
        numberOfLines={1} // Limite le texte à une seule ligne
        ellipsizeMode="tail" // Coupe le texte à la fin si trop long
      >
        {media.original_file_name}
      </Text> */}
    </TouchableOpacity>
  );
}
