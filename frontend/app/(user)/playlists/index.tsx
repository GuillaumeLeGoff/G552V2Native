import { Trash, X } from "lucide-react-native";
import React, { useEffect } from "react";
import { View } from "react-native";
import ActionHeader from "~/components/ActionHeader";
import { Drawer } from "~/components/drawer";
import { ItemPlaylist } from "~/components/ItemPlaylist";
import { Header } from "~/components/ui/header";
import { usePlaylists } from "~/hooks/usePlaylists";
import CreatePlaylist from "./drawer/@createPlaylist";
import AnimatedScrollView from "~/components/AnimatedScrollView";
import FloatingActionButton from "~/components/FloatingActionButton";
import { useSharedValue } from "react-native-reanimated";
import FloatingActionMenu from "~/components/FloatingActionMenu";

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
        <Header
          title="Playlists"
          onIconPress={() => {
            console.log("ChevronDown pressed");
          }}
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
  } = usePlaylists();

  useEffect(() => {
    getPlaylists();
    setSelectPlaylist([]);
  }, []);

  const secondaryButtons = [
    {
      label: "Add",
      onPress: () => setIsOpen(true),
    },
  ];

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

  return (
    <>
      <AnimatedScrollView>
        <HeaderAction />
        <View>
          {playlists &&
            playlists.length > 0 &&
            playlists.map((item) => (
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
            ))}
        </View>
      </AnimatedScrollView>
      <FloatingActionMenu secondaryButtons={secondaryButtons} />
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreatePlaylist />
      </Drawer>
    </>
  );
}

export default PlaylistsList;
