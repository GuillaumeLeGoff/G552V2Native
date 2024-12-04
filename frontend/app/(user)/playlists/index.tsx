import { EllipsisVertical, Plus, Trash, X } from "lucide-react-native";
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
import { Pencil } from "lucide-react-native";
function HeaderAction() {
  const { selectedPlaylist, setSelectPlaylist, deletePlaylists } =
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
        <ActionHeader title="Playlists"   actionsAfterText={[
            {
              icon: EllipsisVertical,
              onPress: () => {},
              size: 24,
              dropDown: [
                {
                  name: "Rename",
                  onPress: () => {},
                  icon: Pencil,
                },
                {
                  name: "Delete",
                  onPress: () => {
                   
                  },
                  icon: Trash,
                },
              ],
            },
          ]}/>
        
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
    />
  );

  return (
    <>
      <FlatList
        ListHeaderComponent={<HeaderAction />}
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
    </>
  );
}

export default PlaylistsList;
