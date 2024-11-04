import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { FlatList, View, StyleSheet, Animated, Modal } from "react-native";
import ItemList from "~/components/dnd/ItemList"; // Assurez-vous que ItemList utilise React.memo
import DragArea from "~/components/dnd/DragArea";
import { useItemStore } from "~/store/item";
import { Item, Layout } from "~/types/Item";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { router } from "expo-router";
import { debounce } from "lodash";
import { usePlaylistStore } from "~/store/playlistStore";
import ActionHeader from "~/components/ActionHeader";
import { Drawer } from "~/components/drawer";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

function Playlist() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Données initiales
  const data = useMemo(
    () => [
      { id: 1, title: "Item 1" },
      { id: 2, title: "Item 2" },
      { id: 3, title: "Item 3" },
      { id: 4, title: "Item 4" },
      { id: 5, title: "Item 5" },
      { id: 6, title: "Item 6" },
      { id: 7, title: "Item 7" },
      { id: 8, title: "Item 8" },
     
    ],
    []
  );

  // Extraction des états et fonctions du store
  const {
    items,
    setItems,
    setDraggingItem,
    setDragOffset,
    dragOffset,
    dragy,
    draggingItem,
  } = useItemStore();

  // Création d'une Map pour une recherche optimisée
  const idToIndexMap = useMemo(() => {
    const map = new Map();
    items.forEach((item, index) => {
      map.set(item.id, index);
    });
    return map;
  }, [items]);

  // Fonction débouncée pour mettre à jour les items
  const debouncedSetItems = useRef(
    debounce((newItems: Item[]) => {
      setItems(newItems);
    }, 50) // Délai en millisecondes, ajustez selon vos besoins
  ).current;

  // Fonction pour mettre à jour la position d'un élément
  const updateItemPosition = useCallback(
    (item: Item, y: number) => {
      const itemHeight = draggingItem?.height ?? 60; // Remplacez par la hauteur réelle de vos items
      const newPosition = Math.floor((y + dragOffset.value) / itemHeight);
      const currentIndex = idToIndexMap.get(item.id);

      // Vérifier si l'index actuel est défini et différent de la nouvelle position
      if (currentIndex === undefined || currentIndex === newPosition) return;

      const updatedItems = [...items];
      updatedItems.splice(currentIndex, 1); // Retirer l'élément de sa position actuelle
      let adjustedPosition = newPosition;
      if (newPosition > currentIndex) {
        adjustedPosition -= 1;
      }
      updatedItems.splice(adjustedPosition, 0, item);

      debouncedSetItems(updatedItems);
    },
    [dragOffset.value, draggingItem, idToIndexMap, items, debouncedSetItems]
  );

  useEffect(() => {
    if (items.length === 0) {
      setItems(data);
    }
  }, [data, items.length, setItems]);

  const handleItemLayout = useCallback(
    (layout: Layout) => {
      setDraggingItem(layout);
    },
    [setDraggingItem]
  );

  const flatListRef = useRef<FlatList>(null);
  const scrollThreshold = 50; 
  const scrollAmount = 10; 

 const scrollFlatList = (y: number) => {
 const listHeight = (items.length * (draggingItem?.height ?? 0) )/ 1.8; 

  if (y < scrollThreshold) {
    flatListRef.current?.scrollToOffset({
      offset: Math.max(y - scrollAmount, 0),
      animated: true,
      })
    } else if (y > listHeight - scrollThreshold) {
      flatListRef.current?.scrollToOffset({
        offset: Math.min(y + scrollAmount, listHeight),
        animated: true,
      });
    }
};

  // Réaction animée pour détecter les mouvements de drag et déclencher le scroll
  useAnimatedReaction(
    () => ({
      y: dragy.value,
      dragging: draggingItem,
    }),
    (result) => {
      if (result.dragging) {
        runOnJS(scrollFlatList)(result.y);
      }
    },
    [dragy, draggingItem, scrollFlatList]
  );

  // Fonction pour obtenir la disposition d'un item (optimisation de FlatList)
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: draggingItem?.height || 60, // Hauteur réelle de l'item
      offset: (draggingItem?.height || 60) * index,
      index,
    }),
    [draggingItem]
  );

  // Fonction pour rendre chaque item (optimisée avec useCallback)
  const renderItem = useCallback(
    ({ item, index }: { item: Item; index: number } ) => (
      <ItemList item={item} index={index} onLayout={handleItemLayout} />
    ),
    [handleItemLayout]
  );
  const pan = Gesture.Pan()
    .onStart(() => {
      console.log("start");
    })
    .onUpdate((event) => {
      console.log("update", event);
    });

  return (
    <Modal >
       <GestureHandlerRootView style={{ flex: 1 }}>
        <HeaderAction />
      
     <View className="flex-1 p-8">
      <DragArea updateItemPosition={updateItemPosition}>
        <Animated.FlatList
          ref={flatListRef}
          onScroll={(e) => {
            setDragOffset(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={10} 
          windowSize={21} 
          removeClippedSubviews={true} 

        />
      </DragArea>
    </View>
</GestureHandlerRootView>
    </Modal>
  );
}


function HeaderAction() {
  const { playlist } = usePlaylistStore();
  return (
    <>
      <ActionHeader
        text={playlist?.name || ""}
        actionsBeforeText={[
          {
            icon: ArrowLeft,
            onPress: () => router.back(),
            size: 24,
          },
        ]}
        /*  actionsAfterText={[
          {
            icon: Trash,
            onPress: () => deletePlaylists(selectedPlaylist),
            size: 20,
          },
        ]} */
      />
    </>
  );
}

export default Playlist;
