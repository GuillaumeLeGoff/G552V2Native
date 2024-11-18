import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import React, { useEffect, useRef } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Circle } from "~/lib/icons/Circle";
import { CircleCheck } from "~/lib/icons/CircleCheck";
import { GripVertical } from "~/lib/icons/GripVertical";
import { useAuthStore } from "~/store/authStore";
import { useItemStore } from "~/store/item";
import { Layout } from "~/types/Item";
import { PlaylistMedia } from "~/types/PlaylistMedia";

export default function ItemList({
  media,
  index,
  selectedPlaylistMedias,
  handlePressPlaylistMedia,
}: {
  media: PlaylistMedia;
  index: number;
  selectedPlaylistMedias: PlaylistMedia[];
  handlePressPlaylistMedia: (item: PlaylistMedia) => void;
}) {
  const viewRef = useRef<View>(null);
  const { setDraggingItem, dragy, draggingItem, dragOffset } = useItemStore();
  const { user } = useAuthStore();

  const handleLongPress = () => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        const layout: Layout = {
          x: x - 28,
          y: y - 82,
          width,
          height,
          media,
          index,
        };
        setDraggingItem(layout);
      });
    }
  };
  const marginTop = useSharedValue(0);
  const ItemHeight = draggingItem?.height || 0;
  useAnimatedReaction(
    () => dragy?.value,
    (newDragY) => {
      if (!newDragY) {
        marginTop.value = 0;
      }

      const itemY = index * ItemHeight;

      // Calculer l'offset si l'élément en cours de déplacement est supprimé de la liste
      const adjustedIndex =
        draggingItem && draggingItem.index <= index ? index - 1 : index;
      const adjustedItemY = adjustedIndex * ItemHeight;

      // Si c'est au-dessus du premier élément
      if (adjustedIndex === 0 && newDragY < adjustedItemY) {
        marginTop.value = withTiming(ItemHeight);
      }

      // Si c'est au-dessus de l'élément actuel
      if (newDragY >= adjustedItemY && newDragY < adjustedItemY + ItemHeight) {
        marginTop.value = withTiming(ItemHeight);
      }

      marginTop.value = withTiming(
        newDragY >= adjustedItemY && newDragY < adjustedItemY + ItemHeight
          ? ItemHeight
          : 0
      );
    }
  );

  useEffect(() => {
    const itemY = index * ItemHeight - dragOffset.value;
    if (draggingItem) {
      marginTop.value =
        dragy.value >= itemY && dragy.value < itemY + ItemHeight
          ? ItemHeight
          : 0;
    } else {
      marginTop.value = 0;
    }
  }, [draggingItem, dragOffset.value]);

  if (draggingItem?.media.id === media.id && draggingItem.index === index) {
    return null;
  }
  return (
    <Animated.View style={{ marginTop }}>
      <Pressable
        onPress={() => handlePressPlaylistMedia(media)}
        onLongPress={handleLongPress}
      >
        <View
          ref={viewRef}
          className={`m-2 bg-card px-10 py-4 rounded-lg items-center flex-row justify-between ${
            selectedPlaylistMedias?.some((m) => m.id === media.id)
              ? "bg-secondary"
              : ""
          }`}
        >
          {selectedPlaylistMedias.length > 0 ? (
            selectedPlaylistMedias?.some((m) => m.id === media.id) ? (
              <CircleCheck size={24} className="text-secondary-foreground" />
            ) : (
              <Circle size={24} className="text-secondary-foreground" />
            )
          ) : (
            <GripVertical size={24} className="text-secondary-foreground" />
          )}
          <Image
            className="rounded-lg "
            source={{
              uri: `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/uploads/${user}/${media.media?.file_name}`,
            }}
            style={{ width: "50%", height: (250 * 9) / 20 }} // Ajuste la hauteur pour un ratio 16:9
          />
          <Text className="text-secondary-foreground text-xl font-avenir-heavy">
            {media.media?.duration || "0"}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
