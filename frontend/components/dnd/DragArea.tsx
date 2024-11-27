import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useItemStore } from "~/store/item";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import DragItem from "./DragItem";
import { CreateButton } from "../createButton";
import { Drawer } from "../drawer";
import AddMediasToPlaylist from "~/app/(user)/playlists/drawer/@addMediasToPlaylist";

export default function DragArea({
  children,
  updateItemPosition,
}: {
  children: React.ReactNode;
  updateItemPosition: (item: PlaylistMedia, index: number) => void;
}) {
  const { setDraggingItem, draggingItem, dragy } = useItemStore();

  const dragx = useSharedValue(0);

  useEffect(() => {
    if (draggingItem) {
      if (draggingItem.x && draggingItem.y) {
      
        dragx.value = draggingItem.x;
        dragy.value = draggingItem.y;
      } /* else {
        dragx.value = 9999999;
        dragy.value = 9999999;
      } */
    }
  }, [draggingItem]);

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      console.log("onTouchesMove", dragx.value, dragy.value);
      if (draggingItem) {
        stateManager.activate();
      }
    })
    .onUpdate((event) => {
      console.log("onUpdate", dragx.value, dragy.value);
      if (draggingItem) {
        dragx.value = draggingItem.x + event.translationX;
        dragy.value = draggingItem.y + event.translationY;
      }
    }).onEnd(() =>{
            
       
      })
    .onFinalize(() => {
      if (draggingItem) {
        
        runOnJS(setDraggingItem)(undefined);
       
        runOnJS(updateItemPosition)(draggingItem.media, dragy.value);
       

      }
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
              <DragItem media={draggingItem.media} />
            </Animated.View>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}
