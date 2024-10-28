import React, { useRef } from "react";
import { Pressable, Text, View, findNodeHandle } from "react-native";
import { useItemStore } from "~/store/item";
import { Item } from "~/types/Item";

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ItemList({
  item,
  onLayout,
}: {
  item: Item;
  onLayout: (layout: Layout) => void;
}) {
  const { setDraggingItem } = useItemStore();
  const viewRef = useRef<View>(null);

  const handleLongPress = () => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        const layout: Layout = { x, y, width, height };
        onLayout(layout);
        setDraggingItem(item);
      });
    }
  };

  return (
    <Pressable onLongPress={handleLongPress}>
      <View
        ref={viewRef}
        className="bg-primary px-10 py-4 rounded-lg items-center"
      >
        <Text className="text-lg font-bold">{item.title}</Text>
      </View>
    </Pressable>
  );
}
