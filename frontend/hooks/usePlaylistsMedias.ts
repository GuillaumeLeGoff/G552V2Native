import { debounce, set } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList } from "react-native";
import { PlaylistMediaService } from "~/services/playlistMedia.service";
import { useItemStore } from "~/store/item";
import { usePlaylistStore } from "~/store/playlistStore";
import { Media } from "~/types/Media";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import { catchError } from "~/utils/catchError";

export const usePlaylistsMedias = () => {
  const [selectedPlaylistMedias, setSelectedPlaylistMedias] = useState<PlaylistMedia[]>([]);
  const [selectedPlaylistMedia, setSelectedPlaylistMedia] = useState<any>(null);
  const [isOpenAddMediasToPlaylist, setIsOpenAddMediasToPlaylist] = useState(false);
  const [isOpenChangePlaylistMediasTime, setIsOpenChangePlaylistMediasTime] = useState(false);
  const { playlist, setPlaylist } = usePlaylistStore();
  const { dragOffset, draggingItem } = useItemStore();


  function handlePressPlaylistMedia(item: PlaylistMedia) {
    if (selectedPlaylistMedias.some((media) => media.id === item.id)) {
      setSelectedPlaylistMedias(
        selectedPlaylistMedias.filter((media) => media.id !== item.id)
      );
    } else {
      setSelectedPlaylistMedias([...selectedPlaylistMedias, item]);
    }
  }

  async function deleteSelectedPlaylistMedias() {
    const [error, data] = await catchError(
      PlaylistMediaService.deletePlaylistMedias(
        selectedPlaylistMedias.map((media) => media.id)
      )
    );
    if (error) {
    } else {
      if (playlist?.id !== undefined) {
        const updatedMedias = (playlist.medias || []).filter(
          (media) =>
            !selectedPlaylistMedias.some((selected) => selected.id === media.id)
        );
        setPlaylist({ ...playlist, medias: updatedMedias });
      }
      setSelectedPlaylistMedias([]);
    }
  }

  const idToIndexMap = useMemo(() => {
    const map = new Map();
    playlist?.medias.forEach((item, index) => {
      map.set(item.id, index);
    });
    return map;
  }, [playlist?.medias]);


  const flatListRef = useRef<FlatList>(null);
  const scrollThreshold = 50;
  const scrollAmount = 10;  
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

  const updatePlaylistMediaTime = async (media: PlaylistMedia, time: number) => {
    const updatedMedia = { ...media, media_dur_in_playlist: time };
    if (playlist?.id !== undefined) {
      setPlaylist({...playlist, medias: [...playlist.medias.map(m => m.id === media.id ? updatedMedia : m)]});
       const [error, data] = await catchError( PlaylistMediaService.updatePlaylistMedia(updatedMedia));
       
       if (error) {
        console.log(error);
       }
    }

  };


  return {
    selectedPlaylistMedias,
    setSelectedPlaylistMedias,
    handlePressPlaylistMedia,
    deleteSelectedPlaylistMedias,
    isOpenAddMediasToPlaylist,
    setIsOpenAddMediasToPlaylist,
    isOpenChangePlaylistMediasTime,
    setIsOpenChangePlaylistMediasTime,
    updateItemPosition,
    scrollFlatList,
    flatListRef,
    scrollThreshold,
    scrollAmount,
    selectedPlaylistMedia,
    setSelectedPlaylistMedia,
    updatePlaylistMediaTime,


  };
};
