import { create } from "zustand";
import { Playlist } from "~/types/Playlist";

interface selectedPlaylist {
  playlist: Playlist[];
  index: number;
}
interface PlaylistStore {
  playlists: Playlist[];
  selectedPlaylist: Playlist[] | null;
  setPlaylists: (playlists: Playlist[]) => void;
  setSelectPlaylist: (playlists: Playlist[]) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  selectedPlaylist: null,
  setPlaylists: (playlists: Playlist[]) => set({ playlists: playlists }), // Ajout du type Playlist[]
  setSelectPlaylist: (playlists: Playlist[]) =>
    set({ selectedPlaylist: playlists }),
}));
