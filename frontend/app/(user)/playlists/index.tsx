import React, { useRef, useState } from 'react';
import {
  Animated,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { ItemList } from '~/components/ItemList';
import { Header } from '~/components/ui/header'; // Assurez-vous que le chemin est correct
import { Modal } from 'react-native'; // {{ edit_1 }}

// Définir l'interface de Playlist
interface Playlist {
  id: number;
  name: string;
}

// Définir la liste des playlists
const PLAYLISTS: Playlist[] = [
  { id: 1, name: 'Playlist Rock' },
  { id: 2, name: 'Playlist Jazz' },
  { id: 3, name: 'Playlist Pop' },
  { id: 4, name: 'Playlist Électro' },
  { id: 5, name: 'Playlist Hip-Hop' },
  { id: 6, name: 'Playlist Classique' },
  { id: 7, name: 'Playlist Reggae' },
  { id: 8, name: 'Playlist Metal' },
];

// Constantes pour le calcul de l'en-tête
const HEADER_MAX_HEIGHT = 16; // Approximation de 64px (en Tailwind, h-16)
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Obtenir la hauteur de la barre d'état
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 24;

// Créer des composants animés avec nativewind
const AnimatedView = Animated.createAnimatedComponent(View);

const PlaylistsScreen: React.FC = () => {
  // Valeur animée pour suivre le défilement
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolation pour la translation de l'en-tête
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  // Interpolation pour l'opacité de l'en-tête
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // États pour la gestion de la modal
  const [modalVisible, setModalVisible] = useState(false); // {{ edit_2 }}
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null); // {{ edit_3 }}

  const handleItemPress = (playlist: Playlist) => { // {{ edit_4 }}
    setSelectedPlaylist(playlist);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 ">
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
            console.log('ChevronDown pressed');
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
          {PLAYLISTS.map((item) => (
            <ItemList key={item.id} title={item.name} onPress={() => handleItemPress(item)} /> // {{ edit_5 }}
          ))}
        </View>
      </Animated.ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Contenu de la modal */}
        <View className="flex-1 justify-center items-center">
          <Text>{selectedPlaylist?.name}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default PlaylistsScreen;