import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Item } from "~/types/Item";

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ItemStore = {
  items: Item[];
  setItems: (items: Item[]) => void;
  draggingItem: Item | undefined;
  setDraggingItem: (item: Item | undefined) => void;
  itemLayouts: { [key: number]: Layout };
  setItemLayouts: (layouts: { [key: number]: Layout }) => void;
};

export const useItemStore = create<ItemStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  draggingItem: undefined,
  setDraggingItem: (item) => set({ draggingItem: item }),
  itemLayouts: {},
  setItemLayouts: (layouts) =>
    set((state) => ({
      itemLayouts: { ...state.itemLayouts, ...layouts },
    })),
}));
