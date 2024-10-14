import { create } from "zustand";
import { Playlist } from "~/types/Playlist";

interface PlaylistStore {
  playlist: Playlist | null;
  playlists: Playlist[];
  selectedPlaylist: Playlist[] | null;
  setPlaylist: (playlist: Playlist) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  setSelectPlaylist: (playlists: Playlist[]) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlist: null,
  playlists: [],
  selectedPlaylist: null,
  setPlaylist: (playlist: Playlist) => set({ playlist: playlist }),
  setPlaylists: (playlists: Playlist[]) => set({ playlists: playlists }), // Ajout du type Playlist[]
  setSelectPlaylist: (playlists: Playlist[]) =>
    set({ selectedPlaylist: playlists }),
}));
