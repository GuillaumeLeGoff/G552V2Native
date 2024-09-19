import { Media } from './Media';
import { Playlist } from './Playlist';

export interface PlaylistMedia {
  id: number;
  media_id: number;
  playlist_id: number;
  media_dur_in_playlist: number;
  media_pos_in_playlist: number;
  media?: Media;
  playlist?: Playlist;
}