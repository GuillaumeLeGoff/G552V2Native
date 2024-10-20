import { Media } from "./Media";
import { PlaylistMedia } from "./PlaylistMedia";

export interface Playlist {
  id: number;
  name: string;
  medias: PlaylistMedia[];
}
