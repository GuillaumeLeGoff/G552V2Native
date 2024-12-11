import { router } from "expo-router";
import { PlaylistService } from "~/services/playlist.service";
import { PlaylistMediaService } from "~/services/playlistMedia.service";
import { usePlaylistStore } from "~/store/playlistStore";
import { Playlist } from "~/types/Playlist";
import { useFolder } from "./useFolder";
import { catchError } from "~/utils/catchError";
import { useState } from "react";

export const usePlaylists = () => {
  const {
    playlist,
    setPlaylist,
    playlists,
    setPlaylists,
    selectedPlaylist,
    setSelectPlaylist,
    sortBy,
    setSortBy,
  } = usePlaylistStore();
  const { selectedFolder, setSelectFolder } = useFolder();

  const [isOpenRenamePlaylist, setIsOpenRenamePlaylist] = useState(false);
  const [isOpenSortBy, setIsOpenSortBy] = useState(false);
  const getPlaylists = async () => {
    try {
      const data = await PlaylistService.getPlaylists();
      const sortedPlaylists = await sortPlaylists(sortBy, data);
      setPlaylists(sortedPlaylists);
    } catch (error) {
      console.error("Failed to fetch playlists", error);
    }
  };
  const createPlaylist = async (name: string) => {
    try {
      const newPlaylist = await PlaylistService.createPlaylist(name);
      const sortedPlaylists = await sortPlaylists(sortBy, [
        ...playlists,
        newPlaylist,
      ]);
      setPlaylists(sortedPlaylists);
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  };
  const deletePlaylists = async (playlistsToDelete: Playlist[]) => {
    const [error] = await catchError(
      PlaylistService.deletePlaylists(playlistsToDelete.map((p) => p.id))
    );
    if (error) {
      console.error("Failed to delete playlists", error);
    } else {
      const sortedPlaylists = await sortPlaylists(
        sortBy,
        playlists.filter(
          (p) => !playlistsToDelete.some((toDelete) => toDelete.id === p.id)
        )
      );
      setPlaylists(sortedPlaylists);
      setPlaylist(null);
      setSelectPlaylist([]);
    }
  };

  const handlePressPlaylist = async (playlist: Playlist) => {
    const data = await PlaylistService.getPlaylist(playlist.id);
    setPlaylist(data);
    router.push(`../../${playlist.id}`);
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
  const handleRenamePlaylist = async (playlist: Playlist, name: string) => {
    const updatedPlaylist = await PlaylistService.updatePlaylist({
      ...playlist,
      name,
    });
    setPlaylist({ ...playlist, name });

    const sortedPlaylists = await sortPlaylists(
      sortBy,
      playlists.map((p) =>
        p.id === playlist.id ? updatedPlaylist : p
      ) as Playlist[]
    );
    setPlaylists(sortedPlaylists);
  };
  const sortPlaylists = async (
    sort: "aToZ" | "zToA" | "dateNew" | "dateOld",
    playlists: Playlist[]
  ) => {
    playlists.sort((a, b) => {
      switch (sort) {
        case "aToZ":
          return a.name.localeCompare(b.name);
        case "zToA":
          return b.name.localeCompare(a.name);
        case "dateNew":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "dateOld":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });
    return playlists;
  };

  const handleSortPlaylist = async (
    sort: "aToZ" | "zToA" | "dateNew" | "dateOld"
  ) => {
    setSortBy(sort);
    const sortedPlaylists = await sortPlaylists(sort, playlists);

    setPlaylists(sortedPlaylists);
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
    handleRenamePlaylist,
    isOpenRenamePlaylist,
    setIsOpenRenamePlaylist,
    sortBy,
    handleSortPlaylist,
    isOpenSortBy,
    setIsOpenSortBy,
  };
};
