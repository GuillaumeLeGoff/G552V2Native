import { router } from "expo-router";
import { debounce } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Animated, FlatList, Modal, View, Button, Alert } from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import ActionHeader from "~/components/ActionHeader";
import DragArea from "~/components/dnd/DragArea";
import ItemList from "~/components/dnd/ItemList"; // Assurez-vous que ItemList utilise React.memo
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { useItemStore } from "~/store/item";
import { usePlaylistStore } from "~/store/playlistStore";
import { Layout } from "~/types/Item";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import { Play } from "~/lib/icons/Play";
import FloatingActionMenu from "~/components/FloatingActionMenu";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import { Drawer } from "~/components/drawer";

function PlaylistModify() {
  const [isOpen, setIsOpen] = useState(false);
  const { playlist, setPlaylist } = usePlaylistStore();
  const { setDragOffset, dragOffset, dragy, draggingItem } = useItemStore();

  // Création d'une Map pour une recherche optimisée
  const idToIndexMap = useMemo(() => {
    const map = new Map();
    playlist?.medias.forEach((item, index) => {
      map.set(item.id, index);
    });
    return map;
  }, [playlist?.medias]);

  // Fonction débouncée pour mettre à jour les items
  const debouncedSetItems = useRef(
    debounce((newMedias: PlaylistMedia[]) => {
      if (playlist?.id !== undefined) {
        setPlaylist({ ...playlist, medias: newMedias });
      }
    }, 50) // Délai en millisecondes, ajustez selon vos besoins
  ).current;

  // Fonction pour mettre à jour la position d'un élément
  const updateItemPosition = useCallback(
    (item: PlaylistMedia, y: number) => {
      console.log("y", y);
      const itemHeight = draggingItem?.height ?? 6; // Remplacez par la hauteur réelle de vos items
      console.log("y / itemHeight", y / itemHeight);
      const newPosition = Math.floor(y / itemHeight);
      const currentIndex = idToIndexMap.get(item.id);

      console.log("newPosition", newPosition);
      console.log("currentIndex", currentIndex);

      // Vérifier si l'index actuel est défini et différent de la nouvelle position
      if (currentIndex === undefined || currentIndex === newPosition) return;

      const updatedMedias = playlist?.medias ? [...playlist.medias] : [];
      updatedMedias.splice(currentIndex, 1); // Retirer l'élément de sa position actuelle
      let adjustedPosition = newPosition;
      /* if (newPosition > currentIndex) {
        adjustedPosition -= 1;
      } */
      updatedMedias.splice(adjustedPosition, 0, item);

      debouncedSetItems(updatedMedias);
    },
    [
      dragOffset.value,
      draggingItem,
      idToIndexMap,
      playlist?.medias,
      debouncedSetItems,
    ]
  );

  const flatListRef = useRef<FlatList>(null);
  const scrollThreshold = 50;
  const scrollAmount = 10;

  const scrollFlatList = (y: number) => {
    const listHeight =
      (playlist?.medias?.length
        ? playlist.medias.length * (draggingItem?.height ?? 0)
        : 0) / 1.8;

    if (y < scrollThreshold) {
      flatListRef.current?.scrollToOffset({
        offset: Math.max(y - scrollAmount, 0),
        animated: true,
      });
    } else if (y > listHeight - scrollThreshold) {
      flatListRef.current?.scrollToOffset({
        offset: Math.min(y + scrollAmount, listHeight),
        animated: true,
      });
    }
  };

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

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: draggingItem?.height || 0,
      offset: (draggingItem?.height || 0) * index,
      index,
    }),
    [draggingItem]
  );
  const renderItem = useCallback(
    ({ item, index }: { item: PlaylistMedia; index: number }) => (
      <ItemList media={item} index={index} />
    ),
    []
  );
  const pan = Gesture.Pan()
    .onStart(() => {
      console.log("start");
    })
    .onUpdate((event) => {
      console.log("update", event);
    });

  const secondaryButtons = [
    {
      label: "Add",
      onPress: () => setIsOpen(true),
    },
  ];

  return (
    <Modal>
      <View className="h-full bg-background px-8">
        <GestureHandlerRootView className="h-full " style={{ flex: 1 }}>
          <HeaderAction />

          <DragArea updateItemPosition={updateItemPosition}>
            <Animated.FlatList
              ref={flatListRef}
              onScroll={(e) => {
                setDragOffset(e.nativeEvent.contentOffset.y);
              }}
              scrollEventThrottle={16}
              data={playlist?.medias || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              initialNumToRender={10}
              windowSize={21}
              removeClippedSubviews={true}
            />
          </DragArea>
        </GestureHandlerRootView>
        <FloatingActionMenu secondaryButtons={secondaryButtons} />

        {/*  <View className="flex-row justify-between items-center absolute bottom-0 left-0 right-0 px-8 py-4 bg-card">
          <View className="bg-secondary rounded-full p-2">
            <Play
              size={20}
              strokeWidth={2.5}
              className="text-secondary-foreground"
            />
          </View>
        </View> */}
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <AddMediasToPlaylist isOpen={isOpen} setIsOpen={setIsOpen} />
        </Drawer>
      </View>
    </Modal>
  );
}

function HeaderAction() {
  const { playlist } = usePlaylistStore();
  return (
    <>
      <ActionHeader
        className="py-8"
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

export default PlaylistModify;
