import { EllipsisVertical, Pencil, Plus, Trash, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import ActionHeader from "~/components/ActionHeader";
import { Drawer, DrawerContent } from "~/components/drawer";
import FloatingActionMenu from "~/components/floatingMenu/FloatingActionMenu";
import { ItemPlaylist } from "~/components/ItemPlaylist";
import { Header } from "~/components/ui/header";
import { usePlaylists } from "~/hooks/usePlaylists";
import { Playlist } from "~/types/Playlist";
import CreatePlaylist from "./drawer/@createPlaylist";
import { ArrowDown } from "~/lib/icons/ArrowDown";
import { ArrowUp } from "~/lib/icons/ArrowUp";
import SortPlaylist from "./drawer/@sortPlaylist";
import { router } from "expo-router";

function HeaderAction({
  setIsOpenSortBy,
}: {
  setIsOpenSortBy: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { selectedPlaylist, setSelectPlaylist, deletePlaylists, sortBy } =
    usePlaylists();

  return (
    <>
      {selectedPlaylist && selectedPlaylist.length > 0 ? (
        <ActionHeader
          text={`${selectedPlaylist.length} sélectionnée(s)`}
          actionsBeforeText={[
            {
              icon: X,
              onPress: () => setSelectPlaylist([]),
              size: 24,
            },
          ]}
          actionsAfterText={[
            {
              icon: Trash,
              onPress: () => deletePlaylists(selectedPlaylist),
              size: 20,
            },
          ]}
        />
      ) : (
        <ActionHeader
          title="Playlists"
          actionsAfterText={[
            {
              icon:
                sortBy === "aToZ"
                  ? ArrowUp
                  : sortBy === "zToA"
                  ? ArrowDown
                  : sortBy === "dateNew"
                  ? ArrowUp
                  : sortBy === "dateOld"
                  ? ArrowDown
                  : ArrowUp,

              onPress: () => setIsOpenSortBy(true),
              size: 20,
              text: sortBy === "aToZ" || sortBy === "zToA" ? "name" : "date",
            },
          ]}
        />
      )}
    </>
  );
}

function PlaylistsList() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isExpanded = useSharedValue(false);

  const {
    playlists,
    handlePressPlaylist,
    selectedPlaylist,
    handleSelectPlaylist,
    getPlaylists,
    setSelectPlaylist,
    isOpenSortBy,
    setIsOpenSortBy,
  } = usePlaylists();

  useEffect(() => {
    getPlaylists();
    setSelectPlaylist([]);
  }, []);

  const secondaryButtons = [
    {
      icon: <Plus />,
      onPress: () => setIsOpen(true),
    },
  ];

  function openModalTest(item: Playlist) {
    router.push(`../../modal`);
  }

  const renderItem = ({ item, index }: { item: Playlist; index: number }) => (
    <ItemPlaylist
      key={item.id}
      title={item.name}
      onPress={() => {
        selectedPlaylist && selectedPlaylist.length > 0
          ? handleSelectPlaylist(item)
          : handlePressPlaylist(item);
      }}
      onLongPress={() => handleSelectPlaylist(item)}
      isSelected={selectedPlaylist?.some((p) => p.id === item.id)}
      isSelectMode={
        selectedPlaylist && selectedPlaylist.length > 0 ? true : false
      }
    />
  );

  return (
    <>
      <FlatList
        ListHeaderComponent={<HeaderAction setIsOpenSortBy={setIsOpenSortBy} />}
        data={playlists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        className="px-8 pb-8"
      />
      {selectedPlaylist && selectedPlaylist.length <= 0 && (
        <FloatingActionMenu secondaryButtons={secondaryButtons} />
      )}
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreatePlaylist />
      </Drawer>
      <Drawer isOpen={isOpenSortBy} onClose={() => setIsOpenSortBy(false)}>
        <SortPlaylist />
      </Drawer>
    </>
  );
}

export default PlaylistsList;
