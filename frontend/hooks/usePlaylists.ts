import { useEffect } from 'react';
import { usePlaylistStore } from '~/store/playlistStore';
import { PlaylistService } from '~/services/playlist.service';
import { useAuth } from '~/hooks/useAuth';

export const usePlaylists = () => {
  const { playlists, setPlaylists, selectPlaylist, selectedPlaylist } = usePlaylistStore();
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
      console.error('Failed to create playlist', error);
    }
  };
  useEffect(() => {
      if (token) {
        console.log("token useEffect", token);
        getPlaylists();
      }
    
  }, []);
  return {
    playlists,
    selectedPlaylist,
    selectPlaylist,
    createPlaylist,
  };
};