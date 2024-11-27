import { router } from "expo-router";
import { PlaylistService } from "~/services/playlist.service";
import { PlaylistMediaService } from "~/services/playlistMedia.service";
import { usePlaylistStore } from "~/store/playlistStore";
import { Playlist } from "~/types/Playlist";
import { useFolder } from "./useFolder";

export const usePlaylists = () => {
  const {
    playlist,
    setPlaylist,
    playlists,
    setPlaylists,
    setSelectPlaylist,
    selectedPlaylist,
  } = usePlaylistStore();
  const { selectedFolder, setSelectFolder } = useFolder();

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
  const deletePlaylists = async (selectedPlaylist: Playlist[]) => {
    await PlaylistService.deletePlaylists(selectedPlaylist.map((p) => p.id));
    setPlaylists(playlists.filter((p) => !selectedPlaylist.includes(p)));
    setSelectPlaylist([]);
  };

  const handlePressPlaylist = async (playlist: Playlist) => {
    const data = await PlaylistService.getPlaylist(playlist.id);
    setPlaylist(data);
    router.push(`/playlists/${playlist.id}`);
  };
  const addMediasToPlaylist = async () => {
    const newPlaylistMedias = selectedFolder.map((item, index) => ({
      playlist_id: playlist?.id || "",
      media_id: item.id,
      media_dur_in_playlist: 1,
      media_pos_in_playlist: playlist?.medias?.length
        ? playlist.medias.length + index + 1
        : index + 1,
    }));

    const newPlaylistMediasCreated =
      await PlaylistMediaService.createPlaylistMedia(newPlaylistMedias);

    const updatedPlaylist = {
      ...playlist,
      medias: [
        ...(playlist?.medias || []),
        ...newPlaylistMedias.map((media, index) => ({
          ...media,
          id: newPlaylistMediasCreated[index].id,
          media: selectedFolder[index],
        })),
      ],
    };
    setPlaylist(updatedPlaylist as Playlist);
    setSelectFolder([]);
  };
  const handleSelectPlaylist = (item: Playlist) => {
    if (selectedPlaylist?.some((p) => p.id === item.id)) {
      setSelectPlaylist(selectedPlaylist.filter((p) => p.id !== item.id));
    } else {
      setSelectPlaylist([...(selectedPlaylist || []), item]);
    }
  };

  return {
    playlists,
    selectedPlaylist,
    addMediasToPlaylist,
    handlePressPlaylist,
    setSelectPlaylist,
    deletePlaylists,
    createPlaylist,
    handleSelectPlaylist,
    getPlaylists,
  };
};
