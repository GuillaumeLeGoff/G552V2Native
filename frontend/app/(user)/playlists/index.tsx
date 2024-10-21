import { Trash, X } from "lucide-react-native"; // {{ edit_1 }}
import React, { useEffect } from "react";
import { Animated, View } from "react-native";
import ActionHeader from "~/components/ActionHeader"; // {{ edit_2 }}
import { CreateButton } from "~/components/createButton";
import { Drawer } from "~/components/drawer";
import { ItemPlaylist } from "~/components/ItemPlaylist";
import { Header } from "~/components/ui/header";
import { usePlaylists } from "~/hooks/usePlaylists"; // {{ edit_1 }}
import CreatePlaylist from "./drawer/@createPlaylist";

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

function PlaylistsScreen() {
  const [isOpen, setIsOpen] = React.useState(false);

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

  return (
    <>
      <Animated.ScrollView>
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
          <CreateButton className="mt-4" onPress={() => setIsOpen(true)} />
        </View>
      </Animated.ScrollView>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreatePlaylist />
      </Drawer>
    </>
  );
}

export default PlaylistsScreen;
