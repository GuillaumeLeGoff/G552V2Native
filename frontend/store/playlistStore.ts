import { create } from "zustand";
import { Playlist } from "~/types/Playlist";

interface PlaylistStore {
  playlist: Playlist | null;
  playlists: Playlist[];
  selectedPlaylist: Playlist[] | null;
  sortBy: "aToZ" | "zToA" | "dateNew" | "dateOld" ;
  setPlaylist: (playlist: Playlist | null) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  setSelectPlaylist: (playlists: Playlist[]) => void;
  setSortBy: (sortBy: "aToZ" | "zToA" | "dateNew" | "dateOld") => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlist: null,
  playlists: [],
  selectedPlaylist: null,
  sortBy: "aToZ",
  setPlaylist: (playlist: Playlist | null) => set({ playlist: playlist }),
  setPlaylists: (playlists: Playlist[]) => set({ playlists: playlists }), // Ajout du type Playlist[]
  setSelectPlaylist: (playlists: Playlist[]) =>
    set({ selectedPlaylist: playlists }),
  setSortBy: (sortBy: "aToZ" | "zToA" | "dateNew" | "dateOld") =>
    set({ sortBy: sortBy }),
}));
