import { PlaylistMedia } from "./PlaylistMedia";

interface Item {
  id: number;
  title: string;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
  media: PlaylistMedia;
  index: number;
}

export type { Item, Layout };
