import { View, StyleSheet } from "react-native";
import DragItem from "./DragItem";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useItemStore } from "~/store/item";
import { GestureStateManager } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gestureStateManager";

export default function DragArea({ children }: { children: React.ReactNode }) {
  const { setDraggingItem, draggingItem, dragy } = useItemStore();

  const dragx = useSharedValue(0);

  useEffect(() => {
    console.log("draggingItem", draggingItem);
    if (draggingItem) {
      console.log(draggingItem);
      if (draggingItem.x && draggingItem.y) {
        dragx.value = draggingItem.x;
        dragy.value = draggingItem.y;
      } else {
        console.warn(`Layout pour l'item ID manque x ou y.`);
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
        console.log(draggingItem);
        dragx.value = draggingItem.x + event.translationX;
        dragy.value = draggingItem.y + event.translationY;
      }
    })
    .onFinalize(() => {
      runOnJS(setDraggingItem)(undefined);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragx.value }, { translateY: dragy.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View style={{ ...StyleSheet.absoluteFillObject }}>
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
