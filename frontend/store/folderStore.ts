import { create } from "zustand";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media"; // Assuming Media is imported from somewhere

interface FolderStore {
  folder: Folder | null;
  selectedItems: (Folder | Media)[]; // Changed from (Folder | Media)[] | null to (Folder | Media)[]
  setFolder: (folder: Folder) => void;
  setSelectItems: (items: (Folder | Media)[]) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folder: null,
  selectedItems: [],
  setFolder: (folders: Folder) => set({ folder: folders }),
  setSelectItems: (items: (Folder | Media)[]) => set({ selectedItems: items }),
}));
