// components/DraggableItem.tsx
import React from "react";
import { Text, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State as GestureState,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { ListItem } from "../types/ListItem";

interface DraggableItemProps {
  item: ListItem;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  moveItem: (from: number, to: number) => void;
  dataLength: number;
}

const ITEM_HEIGHT = 80;

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  activeIndex,
  setActiveIndex,
  moveItem,
  dataLength,
}) => {
  const translateY = useSharedValue(0);
  const isActive = activeIndex === index;

  // Gestion des gestes
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
      runOnJS(setActiveIndex)(index);
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;

      // Calcul du nouvel index basé sur la position actuelle
      let newOrder = Math.floor(
        (index * ITEM_HEIGHT + translateY.value + ITEM_HEIGHT / 2) / ITEM_HEIGHT
      );

      // Clamp le nouvel index entre 0 et dataLength - 1
      newOrder = Math.max(0, Math.min(newOrder, dataLength - 1));

      if (newOrder !== index) {
        runOnJS(moveItem)(index, newOrder);
        runOnJS(setActiveIndex)(newOrder);
      }
    },
    onEnd: () => {
      translateY.value = withTiming(0);
      runOnJS(setActiveIndex)(-1);
    },
  });

  // Styles animés
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: isActive ? 1.05 : 1 },
    ],
    zIndex: isActive ? 1 : 0,
    shadowOpacity: isActive ? 0.2 : 0,
    shadowRadius: isActive ? 10 : 0,
    elevation: isActive ? 5 : 0,
  }));

  // Gestion de l'état de pression longue
  const onLongPressHandlerStateChange = (
    event: LongPressGestureHandlerStateChangeEvent
  ) => {
    if (event.nativeEvent.state === GestureState.ACTIVE) {
      setActiveIndex(index);
    }
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={onLongPressHandlerStateChange}
      minDurationMs={200}
    >
      <Animated.View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.item,
              { backgroundColor: item.backgroundColor },
              animatedStyle,
            ]}
          >
            <Text style={styles.text}>{item.label}</Text>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT - 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    // Ombres pour iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 0,
    // Élévation pour Android
    elevation: 0,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});

export default React.memo(DraggableItem);
