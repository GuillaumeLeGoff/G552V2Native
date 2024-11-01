import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Item, Layout } from "~/types/Item";
import { useSharedValue, SharedValue } from "react-native-reanimated";

type ItemStore = {
  items: Item[];

  setItems: (items: Item[]) => void;
  layoutItems: Layout[] | undefined;
  setLayoutItems: (layout: Layout[]) => void;
  draggingItem: Layout | undefined;
  setDraggingItem: (layout: Layout | undefined) => void;
  dragy: SharedValue<number>;
  setDragy: (value: number) => void;
};

export const useItemStore = create<ItemStore>((set) => {
  const dragy = useSharedValue(0);

  return {
    items: [],
    setItems: (items) => set({ items }),
    layoutItems: [],
    setLayoutItems: (layout) => set({ layoutItems: layout }),

    draggingItem: undefined,
    setDraggingItem: (layout) => set({ draggingItem: layout }),
    dragy,
    setDragy: (value) => {
      dragy.value = value;
    },
  };
});
