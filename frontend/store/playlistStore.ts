import { create } from 'zustand'

interface Playlist {
  id: number;
  name: string;
}

interface PlaylistStore {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
  setPlaylists: (playlists: Playlist[]) => void;
  selectPlaylist: (playlist: Playlist) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  selectedPlaylist: null,
  setPlaylists: (playlists) => set({ playlists }),
  selectPlaylist: (playlist) => set({ selectedPlaylist: playlist }),
}));
