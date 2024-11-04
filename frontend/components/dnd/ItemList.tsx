import React, { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
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
  const { setDraggingItem, dragy, draggingItem, dragOffset } = useItemStore();

  const handleLongPress = () => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y, width, height) => {
        const layout: Layout = { x, y, width, height: height + 8, item, index };
        setDraggingItem(layout);
      }); 
    }
  };
const marginTop = useSharedValue(0);
 const  ItemHeight =  (draggingItem?.height || 0)
  useAnimatedReaction(
    () => dragy?.value,
    (newDragY) => {
      if (!newDragY) {
        marginTop.value = 0;
      }
     
      const itemY = index * ItemHeight  - dragOffset.value;

      // if it's above the first item
      if (index === 0 && newDragY < itemY +  ItemHeight ) {
        marginTop.value = withTiming(ItemHeight);
      }

      // if it's on top of the current item
      // TODO: keep track of the currently dragging item, and offset the comparison, becuase it is deleted form the lists
      marginTop.value = withTiming(
        newDragY >= itemY && newDragY < itemY + ItemHeight ? ItemHeight : 0
      );
    }
  );

   useEffect(() => {
    const itemY = index * ItemHeight  - dragOffset.value;
    if (draggingItem) {
      marginTop.value =
        dragy.value >= itemY && dragy.value < itemY + ItemHeight
          ? ItemHeight
          : 0;
    } else {
      marginTop.value = 0;
    }
  }, [draggingItem ,dragOffset.value ]);


  /* const animatedStyle = useAnimatedStyle(() => {
    if (!dragy.value) {
      return { };
    }

    return {
      transform: [
        {
          translateY: withTiming(
            dragy.value &&
            draggingItem &&
            dragy.value < index * draggingItem.height + draggingItem.height - dragOffset.value
              ? draggingItem.height
              : 0
          ),
        },
      ],
    };
  }); */
  
  if (draggingItem?.item.id === item.id) {
    return <Animated.View style={{ marginTop }} />;
  }
  return (
    <Animated.View style={{ marginTop }}>
      <Pressable onLongPress={handleLongPress}>
        <View
          ref={viewRef}
          className="m-2 bg-primary px-10 py-4 rounded-lg items-center"
        >
          <Text className="text-lg font-bold">{item.title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  ); 
}


