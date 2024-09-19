import React, { useRef, useState } from 'react';
import {
  Animated,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { ItemList } from '~/components/ItemList';
import { Header } from '~/components/ui/header';
import { router } from 'expo-router';
import { usePlaylists } from '~/hooks/usePlaylists'; // {{ edit_1 }}
import { Playlist } from '~/types/Playlist'; // Assurez-vous que le chemin est correct
import { CreateButton } from '~/components/createButton';
import { Drawer } from '~/components/drawer';
import CreatePlaylist from './drawer/@createPlaylist';

const HEADER_MAX_HEIGHT = 16; 
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 24;

const AnimatedView = Animated.createAnimatedComponent(View);

function PlaylistsScreen() {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { playlists, selectPlaylist } = usePlaylists(); // {{ edit_2 }}

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const handleItemPress = (playlist: Playlist) => {
    selectPlaylist(playlist);
    router.push(`/playlists/${playlist.id}`);
  };

  return (
    <View className="flex-1">
      {/* En-tête Animé */}
      <AnimatedView
        style={{
          transform: [{ translateY: headerTranslate }],
          opacity: headerOpacity,
        }}
        className="absolute top-4 left-0 right-0  z-50 pl-8 pt-2"
      >
        <Header
          title="Playlists"
          icon={<ChevronDown size={24} />}
          onIconPress={() => {
            // Action lors de l'appui sur l'icône
            console.log("ChevronDown pressed");
          }}
        />
      </AnimatedView>

      {/* Contenu avec ScrollView Animé */}
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + STATUS_BAR_HEIGHT,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }], // {{ edit_6 }}
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        className="flex-1"
      >
        <View className="px-8 py-8 space-y-4">
          {playlists && playlists.length > 0 &&
            playlists.map(
              (
                item // {{ edit_5 }}
              ) => (
                <ItemList
                  key={item.id}
                  title={item.name}
                  onPress={() => handleItemPress(item)}
                />
              )
            )}
          <CreateButton onPress={() => setIsOpen(true)} />
        </View>
        <View className="px-8 py-8"></View>
      </Animated.ScrollView>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreatePlaylist />
      </Drawer>
    </View>
  );
};

export default PlaylistsScreen;