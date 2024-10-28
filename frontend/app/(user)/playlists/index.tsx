import React, { useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import AnimatedScrollView from "~/components/AnimatedScrollView";
import ItemList from "~/components/dnd/ItemList";
import { Drawer } from "~/components/drawer";
import CreatePlaylist from "./drawer/@createPlaylist";
import DragItem from "~/components/dnd/DragItem";
import DragArea from "~/components/dnd/DragArea";
import { useItemStore } from "~/store/item";

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function PlaylistsScreen() {
  const [isOpen, setIsOpen] = React.useState(false);

  const data = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
    { id: 4, title: "Item 4" },
    { id: 5, title: "Item 5" },
    { id: 6, title: "Item 6" },
    { id: 7, title: "Item 7" },
    { id: 8, title: "Item 8" },
    { id: 9, title: "Item 9" },
    { id: 10, title: "Item 10" },
    { id: 11, title: "Item 11" },
    { id: 12, title: "Item 12" },
    { id: 13, title: "Item 13" },
    { id: 14, title: "Item 14" },
    { id: 15, title: "Item 15" },
  ];

  const { items, setItems, setItemLayouts, } = useItemStore();

  useEffect(() => {
    if (items.length === 0) {
      setItems(data);
    }
  }, []);

  const handleItemLayout = (id: number, layout: Layout) => {
    setItemLayouts({ [id]: layout });
  };

  return (
    <View className="bg-secondary flex-1 p-8">
      <DragArea>
        <FlatList
          style={{ flex: 1, }}
          data={items}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <ItemList
            
              item={item}
              onLayout={(layout) => handleItemLayout(item.id, layout)}
            />
          )}
        />
      </DragArea>
    </View>
  );
}

export default PlaylistsScreen;



