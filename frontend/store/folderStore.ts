import { create } from "zustand";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media"; // Assuming Media is imported from somewhere

interface FolderStore {
  folder: Folder | null;
  selectedFolder: (Folder | Media)[]; // Changed from (Folder | Media)[] | null to (Folder | Media)[]
  setFolder: (folder: Folder) => void;
  setSelectFolder: (items: (Folder | Media)[]) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folder: null,
  selectedFolder: [],
  setFolder: (folders: Folder) => set({ folder: folders }),
  setSelectFolder: (items: (Folder | Media)[]) => set({ selectedFolder: items }),
}));
