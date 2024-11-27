import { router } from "expo-router";
import { debounce } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, BackHandler, FlatList, Modal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
import { PlaylistMediaService } from "~/services/playlistMedia.service";
import { useItemStore } from "~/store/item";
import { usePlaylistStore } from "~/store/playlistStore";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import ChangePlaylistMediasTime from "./drawer/@changePlaylistMediasTime";


function PlaylistModify() {

  const { playlist } = usePlaylistStore();
  const { setDragOffset, dragy, draggingItem } = useItemStore();
  const {
    selectedPlaylistMedias,
    handlePressPlaylistMedia,
    setSelectedPlaylistMedias,
    deleteSelectedPlaylistMedias,
    isOpenAddMediasToPlaylist,
    setIsOpenAddMediasToPlaylist,
    isOpenChangePlaylistMediasTime,
    setIsOpenChangePlaylistMediasTime,
    updateItemPosition,
    scrollFlatList,
    flatListRef,
    selectedPlaylistMedia,
    setSelectedPlaylistMedia,
  } = usePlaylistsMedias(); 

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

  const ItemHeight = 150; // Définir la hauteur de chaque élément (ajustez cette valeur selon vos besoins)
  const contentHeight = (playlist?.medias.length || 0) * ItemHeight; // Calculer la hauteur totale du contenu

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <ItemList
        openDrawer={() => {
          setSelectedPlaylistMedia(item);
          setIsOpenChangePlaylistMediasTime(true);
        }}
        media={item}
        index={index}
        selectedPlaylistMedias={selectedPlaylistMedias}
        handlePressPlaylistMedia={handlePressPlaylistMedia}
      />
    ),
    [selectedPlaylistMedias, handlePressPlaylistMedia, selectedPlaylistMedia]
  );

  const secondaryButtons = [
    {
      icon: null,
      onPress: () => setIsOpenAddMediasToPlaylist(true),
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
              contentContainerStyle={{ height: contentHeight + ItemHeight }}
            />
          </DragArea>
        </GestureHandlerRootView>
        <FloatingActionMenu secondaryButtons={secondaryButtons} />
        <Drawer
          isOpen={isOpenChangePlaylistMediasTime}
          onClose={() => setIsOpenChangePlaylistMediasTime(false)}
        >
          <ChangePlaylistMediasTime
            isOpen={isOpenChangePlaylistMediasTime}
            setIsOpen={setIsOpenChangePlaylistMediasTime}
            selectedPlaylistMedia={selectedPlaylistMedia}           
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
