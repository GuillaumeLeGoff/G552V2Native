import { create } from "zustand";
import { Folder } from "~/types/Folder";

interface FolderStore {
  folders: Folder[];
  currentFolderId: number | null;
  selectedFolder: Folder[] | null;
  setFolders: (folders: Folder[]) => void;
  setCurrentFolderId: (id: number | null) => void;
  setSelectFolder: (folders: Folder[]) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folders: [],
  currentFolderId: null,
  selectedFolder: null,
  setFolders: (folders: Folder[]) => set({ folders: folders }),
  setCurrentFolderId: (id: number | null) => set({ currentFolderId: id }),
  setSelectFolder: (folders: Folder[]) => set({ selectedFolder: folders }),
}));
