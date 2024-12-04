import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Animated, BackHandler, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import ActionHeader from "~/components/ActionHeader";
import DragArea from "~/components/dnd/DragArea";
import ItemList from "~/components/dnd/ItemList";
import { Drawer } from "~/components/drawer";
import FloatingActionMenu from "~/components/floatingMenu/FloatingActionMenu";
import { usePlaylistsMedias } from "~/hooks/usePlaylistsMedias";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { EllipsisVertical } from "~/lib/icons/EllipsisVertical";
import { Pencil } from "~/lib/icons/Pencil";
import { Trash } from "~/lib/icons/Trash";
import { X } from "~/lib/icons/X";
import { useItemStore } from "~/store/item";
import { usePlaylistStore } from "~/store/playlistStore";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import AddMediasToPlaylist from "./drawer/@addMediasToPlaylist";
import ChangePlaylistMediasTime from "./drawer/@changePlaylistMediasTime";
import { usePlaylists } from "~/hooks/usePlaylists";
import RenamePlaylist from "./drawer/@renamePlaylist";

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

  const { isOpenRenamePlaylist, setIsOpenRenamePlaylist } = usePlaylists();

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
    <View className="h-full bg-background px-8">
      <GestureHandlerRootView className="h-full " style={{ flex: 1 }}>
        <HeaderAction
          selectedPlaylistMedias={selectedPlaylistMedias}
          setSelectedPlaylistMedias={setSelectedPlaylistMedias}
          deleteSelectedPlaylistMedias={deleteSelectedPlaylistMedias}
          playlistName={playlist?.name || ""}
          setIsOpenRenamePlaylist={setIsOpenRenamePlaylist}
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
      <Drawer
        isOpen={isOpenRenamePlaylist}
        onClose={() => setIsOpenRenamePlaylist(false)}
      >
        <RenamePlaylist />
      </Drawer>
    </View>
  );
}

function HeaderAction({
  selectedPlaylistMedias,
  setSelectedPlaylistMedias,
  deleteSelectedPlaylistMedias,
  playlistName,
  setIsOpenRenamePlaylist,
}: {
  selectedPlaylistMedias: PlaylistMedia[];
  setSelectedPlaylistMedias: (medias: PlaylistMedia[]) => void;
  deleteSelectedPlaylistMedias: () => void;
  playlistName: string;
  setIsOpenRenamePlaylist: (isOpen: boolean) => void;
}) {
  const { deletePlaylists } = usePlaylists();
  const { playlist } = usePlaylistStore();
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
          actionsAfterText={[
            {
              icon: EllipsisVertical,
              onPress: () => {},
              size: 24,
              dropDown: [
                {
                  name: "Rename",
                  onPress: () => setIsOpenRenamePlaylist(true),
                  icon: Pencil,
                },
                {
                  name: "Delete",
                  onPress: () => {
                    if (playlist) {
                      deletePlaylists([playlist]);
                      router.back();
                    }
                  },
                  icon: Trash,
                },
              ],
            },
          ]}
        />
      )}
    </>
  );
}

export default PlaylistModify;
