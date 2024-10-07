import { User } from "./User";
import { PlaylistMedia } from "./PlaylistMedia";
import { Folder } from "./Folder";

export interface Media {
  id: number;
  original_file_name: string;
  file_name: string;
  path: string;
  format: string;
  type: "media"; // Doit être strictement 'media'
  thumbnail_path: string | null;
  thumbnail_name: string | null;
  size: number;
  uploaded_at: Date;
  user_id: number;
  folder_id: number | null;
  user?: User;
  Playlist_media?: PlaylistMedia[];
  folder?: Folder | null;
}
