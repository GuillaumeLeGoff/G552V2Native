// components/DraggableList.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
} from "react-native";
import { ListItem } from "../types/ListItem";
import DraggableItem from "./DraggableItem";

interface DraggableListProps {
  data: ListItem[];
  setData: React.Dispatch<React.SetStateAction<ListItem[]>>;
}

const DraggableList: React.FC<DraggableListProps> = ({ data, setData }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Activation de LayoutAnimation pour Android
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
});

export default DraggableList;
