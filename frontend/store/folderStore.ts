import { create } from "zustand";
import { Folder } from "~/types/Folder";
import { Media } from "~/types/Media"; // Assuming Media is imported from somewhere

interface FolderStore {
  folder: Folder | null;
  selectedFolder: (Folder | Media)[]; // Changed from (Folder | Media)[] | null to (Folder | Media)[]
  sortFolder: "aToZ" | "zToA" | "dateNew" | "dateOld";
  setFolder: (folder: Folder) => void;
  setSelectFolder: (items: (Folder | Media)[]) => void;
  setSortFolder: (sort: "aToZ" | "zToA" | "dateNew" | "dateOld") => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folder: null,
  selectedFolder: [],
  sortFolder: "aToZ",
  setFolder: (folders: Folder) => set({ folder: folders }),
  setSelectFolder: (items: (Folder | Media)[]) => set({ selectedFolder: items }),
  setSortFolder: (sort: "aToZ" | "zToA" | "dateNew" | "dateOld") =>
    set({ sortFolder: sort }),
}));
