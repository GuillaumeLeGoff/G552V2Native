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
  openDrawer,
}: {
  media: PlaylistMedia;
  index: number;
  selectedPlaylistMedias: PlaylistMedia[];
  handlePressPlaylistMedia: (item: PlaylistMedia) => void;
  openDrawer: () => void;
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
          height: height + 16,
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
      if (draggingItem) {
        const itemY = index * ItemHeight;

        const adjustedIndex =
          draggingItem && draggingItem.index <= index ? index - 1 : index;
        const adjustedItemY = adjustedIndex * ItemHeight;

        if (adjustedIndex === 0 && newDragY < itemY) {
          marginTop.value = withTiming(ItemHeight);
        } else if (
          newDragY >= adjustedItemY &&
          newDragY < adjustedItemY + ItemHeight
        ) {
          marginTop.value = withTiming(ItemHeight);
        } else {
          marginTop.value = withTiming(0);
        }
        // TODO: keep track of the currently dragging item, and offset the comparison, becuase it is deleted form the lists
      }
    }
  );

  useEffect(() => {
    const itemY = index * ItemHeight
    if (draggingItem) {
      marginTop.value =
        dragy.value >= itemY && dragy.value < itemY + ItemHeight
          ? ItemHeight
          : 0;
    } else {
      marginTop.value = 0;
    }
  }, [draggingItem]);

  if (draggingItem?.media.id === media.id && draggingItem.index === index) {
    return  <Animated.View style={{ marginTop }} />;
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
          <View   className="flex-row justify-center items-center">
            <Pressable
              onPress={ selectedPlaylistMedias.length === 0 ? openDrawer : undefined}
              style={{width: 50}}
              className={`rounded-xl p-2 bg-secondary  justify-center items-center ${selectedPlaylistMedias.length > 0 && selectedPlaylistMedias.some((m) => m.id === media.id) ? "border-2 border-secondary-foreground" : ""} `}
            >
            <Text className="text-secondary-foreground text-xl font-avenir-heavy px-1  ">
              {media.media_dur_in_playlist || "0"}
            </Text>
            </Pressable>
            <Text className={`text-secondary-foreground text-xl font-avenir-heavy `}>
              {" "}s
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
