import React, { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useItemStore } from "~/store/item";
import { Item, Layout } from "~/types/Item";

export default function ItemList({
  item,
  index,
  onLayout,
}: {
  item: Item;
  index: number;
  onLayout: (layout: Layout) => void;
}) {
  const viewRef = useRef<View>(null);
  const { setDraggingItem, dragy, draggingItem } = useItemStore();

  const handleLongPress = () => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        const layout: Layout = { x, y, width, height, item };
        setDraggingItem(layout);
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          dragy.value &&
            draggingItem &&
            dragy.value < index * draggingItem.height + draggingItem.height
            ? draggingItem.height
            : 0
        ),
      },
    ],
  }));

  useEffect(() => {
    /*  console.log("draggingItem", draggingItem);
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        const layout: Layout = { x, y, width, height, item };
        onLayout(layout);
      });
    } */
  }, []);

  return draggingItem?.item.id !== item.id ? (
    <Animated.View style={animatedStyle}>
      <Pressable onLongPress={handleLongPress}>
        <View
          ref={viewRef}
          className="bg-primary px-10 py-4 rounded-lg items-center"
        >
          <Text className="text-lg font-bold">{item.title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  ) : null;
}
