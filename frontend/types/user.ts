import { ActiveSession } from './ActiveSession';
import { Playlist } from './Playlist';
import { Macro } from './Macro';
import { Media } from './Media';
import { Scoring } from './Scoring';
import { Folder } from './Folder';

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  first_login: boolean;
  active_token: string | null;
  event_auto: boolean;
  language: string | null;
  activeSessions?: ActiveSession[];
  playlists?: Playlist[];
  macros?: Macro[];
  medias?: Media[];
  scorings?: Scoring[];
  folder?: Folder[];
}
