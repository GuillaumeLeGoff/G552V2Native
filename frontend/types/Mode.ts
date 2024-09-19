import { Playlist } from './Playlist';

export interface Mode {
  id: number;
  name: string | null;
  playlist_id: number | null;
  playlist?: Playlist | null;
}