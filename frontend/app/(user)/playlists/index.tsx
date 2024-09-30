import { X } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateButton } from "~/components/createButton";
import { Drawer } from "~/components/drawer";
import { ItemList } from "~/components/ItemList";
import { Header } from "~/components/ui/header";
import { usePlaylists } from "~/hooks/usePlaylists"; // {{ edit_1 }}
import { Trash } from "~/lib/icons/Trash";
import CreatePlaylist from "./drawer/@createPlaylist";
const HEADER_MAX_HEIGHT = 16;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const STATUS_BAR_HEIGHT =
  Platform.OS === "ios" ? 20 : StatusBar.currentHeight || 24;

const AnimatedView = Animated.createAnimatedComponent(View);

function HeaderAction() {
  const { selectedPlaylist, setSelectPlaylist, deletePlaylists } =
    usePlaylists();

  return (
    <>
      {selectedPlaylist && selectedPlaylist.length > 0 ? (
        <View className="flex flex-row items-start">
          <TouchableOpacity
            className="pt-1 pr-2 "
            onPress={() => {
              setSelectPlaylist([]);
            }}
          >
            <X size={24} strokeWidth={3} className="text-primary" />
          </TouchableOpacity>
          <Text className="font-avenir-heavy text-primary flex-1 text-2xl font-bold">
            {selectedPlaylist?.length} sélectionnée(s)
          </Text>
          <TouchableOpacity
            className="pt-1"
            onPress={() => {
              deletePlaylists(selectedPlaylist);
            }}
          >
            <Trash size={20} strokeWidth={3} className="text-primary" />
          </TouchableOpacity>
        </View>
      ) : (
        <Header
          title="Playlists"
          onIconPress={() => {
            // Action lors de l'appui sur l'icône
            console.log("ChevronDown pressed");
          }}
        />
      )}
    </>
  );
}

function PlaylistsScreen() {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const { playlists, handleItemLongPress, selectedPlaylist, handleItemPress } =
    usePlaylists();

  return (
    <View className="flex-1">
      <AnimatedView
        style={{
          transform: [{ translateY: headerTranslate }],
          opacity: headerOpacity,
        }}
        className="absolute top-4 left-0 right-0 z-50 px-8 pt-2"
      >
        <HeaderAction />
      </AnimatedView>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + STATUS_BAR_HEIGHT,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        className="flex-1"
      >
        <View className="px-8 py-8 space-y-4">
          {playlists &&
            playlists.length > 0 &&
            playlists.map((item) => (
              <ItemList
                key={item.id}
                title={item.name}
                onPress={() => {
                  selectedPlaylist && selectedPlaylist.length > 0
                    ? handleItemLongPress(item)
                    : handleItemPress(item);
                }}
                onLongPress={() => handleItemLongPress(item)}
                isSelected={selectedPlaylist?.some((p) => p.id === item.id)}
              />
            ))}
          <CreateButton className="mt-4" onPress={() => setIsOpen(true)} />
        </View>
      </Animated.ScrollView>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreatePlaylist />
      </Drawer>
    </View>
  );
}

export default PlaylistsScreen;
