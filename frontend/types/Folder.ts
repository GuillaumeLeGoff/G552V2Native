import { User } from "./User";
import { Media } from "./Media";

export interface Folder {
  id: number;
  name: string;
  user_id: number;
  user?: User;
  media?: Media[];
  parent?: Folder | null;
  parent_id: number | null;
  subFolders?: Folder[] | null;
  path: string | null;
  updated_at: Date;
  folderId: number | null;
  type: "folder"; // Doit être strictement 'folder'
}
