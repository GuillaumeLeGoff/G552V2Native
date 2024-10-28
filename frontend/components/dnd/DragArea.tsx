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
  const { draggingItem, setDraggingItem, itemLayouts } = useItemStore();

 const dragx = useSharedValue(0);
  const dragy = useSharedValue(0);

  useEffect(() => {
    if (draggingItem && itemLayouts[draggingItem.id]) {
      const layout = itemLayouts[draggingItem.id];
      if (layout.x && layout.y) { // Ajouté pour vérifier que x et y sont définis
        dragx.value = layout.x;
        dragy.value = layout.y;
      } else {
        console.warn(`Layout pour l'item ID ${draggingItem.id} manque x ou y.`);
      }
    }
  }, [draggingItem, itemLayouts]);

  const pan = Gesture.Pan().manualActivation(true) .onTouchesMove((event, stateManager) => {
      if (draggingItem) {
        stateManager.activate();
      }
    })
    .onUpdate((event) => {
      if (draggingItem && itemLayouts[draggingItem.id]) {
        dragx.value = itemLayouts[draggingItem.id].x + event.translationX;
        dragy.value = itemLayouts[draggingItem.id].y + event.translationY;
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
         <View
            style={{...StyleSheet.absoluteFillObject}}
          >
             {children}
           {draggingItem && itemLayouts[draggingItem.id] && ( <Animated.View style={[animatedStyle, { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }]}>
              <DragItem item={draggingItem} />
           </Animated.View>
            )}
            </View>
        </GestureDetector>
    </View>
  );
}



