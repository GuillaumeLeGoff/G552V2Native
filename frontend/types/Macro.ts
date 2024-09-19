import { Playlist } from './Playlist';
import { Button } from './Button';
import { User } from './User';

export interface Macro {
  playlist_id: number | null;
  button_id: number;
  user_id: number;
  playlist?: Playlist | null;
  button?: Button;
  user?: User;
}