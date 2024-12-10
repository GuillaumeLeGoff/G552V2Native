import { User } from "./User";
import { PlaylistMedia } from "./PlaylistMedia";
import { Folder } from "./Folder";

export interface Media {
  id: number;
  original_file_name: string;
  file_name: string;
  path: string;
  format: string;
  type: "media";
  thumbnail_path: string | null;
  thumbnail_name: string | null;
  size: number;
  uploaded_at: Date;
  user_id: number;
  folder_id: number | null;
  duration: number | null;
  user?: User;
  Playlist_media?: PlaylistMedia[];
  folder?: Folder | null;
  updated_at: Date;
  created_at: Date;
}
