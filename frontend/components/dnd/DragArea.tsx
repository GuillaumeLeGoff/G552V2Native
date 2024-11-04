import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import DragItem from "./DragItem";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useItemStore } from "~/store/item";
import { Item } from "~/types/Item";

export default function DragArea({
  children,
  updateItemPosition,
}: {
  children: React.ReactNode;
  updateItemPosition: (item: Item, y: number) => void;
}) {
  const { setDraggingItem, draggingItem, dragy, dragOffset } = useItemStore();

  const dragx = useSharedValue(0);
  const dragyShared = useSharedValue(0);

  // Fonction de log pour le thread principal
  const log = (message) => {
    console.log(message);
  };

  useEffect(() => {
    if (draggingItem) {
      console.log("Dragging started for item:", draggingItem.item.id);
      if (draggingItem.x && draggingItem.y) {
        dragx.value = draggingItem.x;
        dragyShared.value = draggingItem.y;
        runOnJS(log)(
          `Initial dragx: ${dragx.value}, dragyShared: ${dragyShared.value}`
        );
      } else {
        console.warn(
          `Layout pour l'item ID ${draggingItem.item.id} manque x ou y.`
        );
      }
    }
  }, [draggingItem]);

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      if (draggingItem) {
        stateManager.activate();
      }
    })
    .onUpdate((event) => {
      if (draggingItem) {
        dragx.value = draggingItem.x + event.translationX;
        dragyShared.value = draggingItem.y + event.translationY;
        dragy.value = draggingItem.y + event.translationY; // Update dragy dans le store
        runOnJS(log)(
          `During drag - dragx: ${dragx.value}, dragyShared: ${dragyShared.value}`
        );
      }
    })
    .onFinalize(() => {
      if (draggingItem) {
        runOnJS(log)(`Final dragyShared: ${dragyShared.value}`);
        runOnJS(updateItemPosition)(draggingItem.item, dragyShared.value);
      }

      runOnJS(setDraggingItem)(undefined);
      runOnJS(log)("Dragging ended");
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragx.value }, { translateY: dragyShared.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View style={styles.container}>
          {children}
          {draggingItem && (
            <Animated.View
              style={[
                animatedStyle,
                { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
              ]}
            >
              <DragItem />
            </Animated.View>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
