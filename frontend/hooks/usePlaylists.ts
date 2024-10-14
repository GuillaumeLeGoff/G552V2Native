import { router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { PlaylistService } from "~/services/playlist.service";
import { usePlaylistStore } from "~/store/playlistStore";
import { Playlist } from "~/types/Playlist";

export const usePlaylists = () => {
  const {
    playlists,
    setPlaylists,
    setSelectPlaylist,
    selectedPlaylist,
    setPlaylist,
  } = usePlaylistStore();
  const { token } = useAuth();

  const getPlaylists = async () => {
    try {
      const data = await PlaylistService.getPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    }
  };

  const createPlaylist = async (name: string) => {
    try {
      const newPlaylist = await PlaylistService.createPlaylist(name);
      setPlaylists([...playlists, newPlaylist]);
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  };

  const handleItemLongPress = (item: Playlist) => {
    if (selectedPlaylist?.some((p) => p.id === item.id)) {
      setSelectPlaylist(selectedPlaylist.filter((p) => p.id !== item.id));
    } else {
      setSelectPlaylist([...(selectedPlaylist || []), item]);
    }
    console.log("item", item);
    console.log("selectedPlaylist", selectedPlaylist);
  };

  const deletePlaylists = async (selectedPlaylist: Playlist[]) => {
    await PlaylistService.deletePlaylists(selectedPlaylist.map((p) => p.id));
    setPlaylists(playlists.filter((p) => !selectedPlaylist.includes(p)));
    setSelectPlaylist([]);
  };

  const handleItemPress = (playlist: Playlist) => {
    setPlaylist(playlist);
    router.push(`/playlists/${playlist.id}`);
  };

  useEffect(() => {
    if (token) {
      console.log("token useEffect", token);
      getPlaylists();
      setSelectPlaylist([]);
    }
  }, []);
  return {
    playlists,
    selectedPlaylist,
    handleItemPress,
    setSelectPlaylist,
    deletePlaylists,
    createPlaylist,
    handleItemLongPress,
  };
};
