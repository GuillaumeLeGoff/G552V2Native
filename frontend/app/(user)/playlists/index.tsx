// PlaylistsScreen.tsx
import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  FlatList,
} from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

// Activation de LayoutAnimation pour Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Définition des types
interface ListItem {
  key: string;
  label: string;
  backgroundColor: string;
}

// Composant DraggableItem
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

  // Définir le geste
  const gesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setActiveIndex)(index);
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;

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
    })
    .onEnd(() => {
      translateY.value = withTiming(0);
      runOnJS(setActiveIndex)(-1);
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

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.item,
          { backgroundColor: item.backgroundColor },
          animatedStyle,
        ]}
      >
        <Text style={styles.text}>{item.label}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

// Composant DraggableList
interface DraggableListProps {
  data: ListItem[];
  setData: React.Dispatch<React.SetStateAction<ListItem[]>>;
}

const DraggableList: React.FC<DraggableListProps> = ({ data, setData }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Fonction pour déplacer un élément dans la liste
  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= data.length) return;
    if (from === to) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedData = [...data];
    const [movedItem] = updatedData.splice(from, 1);
    updatedData.splice(to, 0, movedItem);
    setData(updatedData);
  };

  // Rendu de chaque élément de la liste
  const renderItem = ({ item, index }: { item: ListItem; index: number }) => (
    <DraggableItem
      item={item}
      index={index}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      moveItem={moveItem}
      dataLength={data.length}
    />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      scrollEnabled={true}
      contentContainerStyle={styles.listContainer}
      extraData={activeIndex} // Pour forcer le re-render lorsque activeIndex change
    />
  );
};

// Fonction pour générer les données initiales
const generateInitialData = (): ListItem[] => {
  return Array.from({ length: 20 }, (_, index) => ({
    key: `item-${index}`,
    label: `Élément ${index + 1}`,
    backgroundColor: `rgba(0, 122, 255, ${0.5 + (index + 1) * 0.025})`,
  }));
};

// Composant principal PlaylistsScreen
const PlaylistsScreen: React.FC = () => {
  const [data, setData] = useState<ListItem[]>(generateInitialData());

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <DraggableList data={data} setData={setData} />
        <StatusBar />
      </View>
    </GestureHandlerRootView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingVertical: 10,
  },
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

export default PlaylistsScreen;
