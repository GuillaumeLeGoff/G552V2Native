import { router } from "expo-router";
import { debounce } from "lodash";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Animated, FlatList, Modal, View, BackHandler } from "react-native";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import ActionHeader from "~/components/ActionHeader";
import DragArea from "~/components/dnd/DragArea";
import ItemList from "~/components/dnd/ItemList";
import { Drawer } from "~/components/drawer";
import FloatingActionMenu from "~/components/floatingMenu/FloatingActionMenu";
import { usePlaylistsMedias } from "~/hooks/usePlaylistsMedias";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Trash } from "~/lib/icons/Trash";
import { X } from "~/lib/icons/X";
import { useItemStore } from "~/store/item";
import { usePlaylistStore } from "~/store/playlistStore";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import { PlaylistMediaService } from "~/services/playlistMedia.service";
import ChangePlaylistMediasTime from "./drawer/@changePlaylistMediasTime";
import NumberPicker from "~/components/scrollPicker";

function PlaylistModify() {
  const [isOpenAddMediasToPlaylist, setIsOpenAddMediasToPlaylist] =
    useState(false);
  const [isOpenChangePlaylistMediasTime, setIsOpenChangePlaylistMediasTime] =
    useState(false);
  const { playlist, setPlaylist } = usePlaylistStore();
  const { setDragOffset, dragOffset, dragy, draggingItem } = useItemStore();
  const {
    selectedPlaylistMedias,
    handlePressPlaylistMedia,
    setSelectedPlaylistMedias,
    deleteSelectedPlaylistMedias,
  } = usePlaylistsMedias();

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
    async (item: PlaylistMedia, y: number) => {
      const itemHeight = draggingItem?.height ?? 6;
      let newPosition = Math.floor(y / itemHeight);
      const currentIndex = idToIndexMap.get(item.id);

      // Assurez-vous que la nouvelle position ne dépasse pas les limites
      newPosition = Math.max(0, newPosition);
      newPosition = Math.min(newPosition, (playlist?.medias?.length || 1) - 1);

      if (currentIndex === undefined || currentIndex === newPosition) return;

      const updatedMedias = playlist?.medias ? [...playlist.medias] : [];
      updatedMedias.splice(currentIndex, 1);
      updatedMedias.splice(newPosition, 0, item);

      // Mettre à jour la position des médias dans la liste
      updatedMedias.forEach((media, index) => {
        media.media_pos_in_playlist = index; // Mise à jour de la position
      });

      await PlaylistMediaService.updateMediaOrder(updatedMedias);

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

  const openDrawerChangePlaylistMediasTime = (item: PlaylistMedia) => {
    setIsOpenChangePlaylistMediasTime(true);
    console.log(item);
    /* setSelectedPlaylistMedias([item]); */
  };
  const renderItem = useCallback(
    ({ item, index }: { item: PlaylistMedia; index: number }) => (
      <ItemList
        openDrawer={() => openDrawerChangePlaylistMediasTime(item)}
        media={item}
        index={index}
        selectedPlaylistMedias={selectedPlaylistMedias}
        handlePressPlaylistMedia={handlePressPlaylistMedia}
      />
    ),
    [selectedPlaylistMedias, handlePressPlaylistMedia]
  );

  const secondaryButtons = [
    {
      icon: null,
      onPress: () => setIsOpenChangePlaylistMediasTime(true),
    },
  ];

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <Modal>
      <View className="h-full bg-background px-8">
        <NumberPicker />
        <GestureHandlerRootView className="h-full " style={{ flex: 1 }}>
          <HeaderAction
            selectedPlaylistMedias={selectedPlaylistMedias}
            setSelectedPlaylistMedias={setSelectedPlaylistMedias}
            deleteSelectedPlaylistMedias={deleteSelectedPlaylistMedias}
            playlistName={playlist?.name || ""}
          />

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
        <Drawer
          isOpen={isOpenChangePlaylistMediasTime}
          onClose={() => setIsOpenChangePlaylistMediasTime(false)}
        >
          <ChangePlaylistMediasTime
            isOpen={isOpenChangePlaylistMediasTime}
            setIsOpen={setIsOpenChangePlaylistMediasTime}
          />
        </Drawer>
        <Drawer
          isOpen={isOpenAddMediasToPlaylist}
          onClose={() => setIsOpenAddMediasToPlaylist(false)}
        >
          <AddMediasToPlaylist
            isOpen={isOpenAddMediasToPlaylist}
            setIsOpen={setIsOpenAddMediasToPlaylist}
          />
        </Drawer>
      </View>
    </Modal>
  );
}

function HeaderAction({
  selectedPlaylistMedias,
  setSelectedPlaylistMedias,
  deleteSelectedPlaylistMedias,
  playlistName,
}: {
  selectedPlaylistMedias: PlaylistMedia[];
  setSelectedPlaylistMedias: (medias: PlaylistMedia[]) => void;
  deleteSelectedPlaylistMedias: () => void;
  playlistName: string;
}) {
  return (
    <>
      {selectedPlaylistMedias && selectedPlaylistMedias.length > 0 ? (
        <ActionHeader
          className="py-8"
          text={`${selectedPlaylistMedias.length} sélectionné(s)`}
          actionsBeforeText={[
            {
              icon: X,
              onPress: () => setSelectedPlaylistMedias([]),
              size: 24,
            },
          ]}
          actionsAfterText={[
            {
              icon: Trash,
              onPress: () => deleteSelectedPlaylistMedias(),
              size: 20,
            },
          ]}
        />
      ) : (
        <ActionHeader
          className="py-8"
          text={playlistName || ""}
          actionsBeforeText={[
            {
              icon: ArrowLeft,
              onPress: () => router.back(),
              size: 24,
            },
          ]}
        />
      )}
    </>
  );
}

export default PlaylistModify;
