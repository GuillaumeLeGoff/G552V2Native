import { User } from './User';
import { Media } from './Media';

export interface Folder {
  id: number;
  name: string;
  user_id: number;
  user?: User;
  media?: Media[];
  parent?: Folder | null;
  parent_id: number | null;
  subFolders?: Folder[];
  updated_at: Date;
  folderId: number | null;
}