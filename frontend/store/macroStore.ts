import { create } from "zustand";
import { Macro } from "~/types/Macro";


interface MacroStore {
  macros: Macro[];
  setMacros: (macros: Macro[]) => void;
}

export const useMacroStore = create<MacroStore>((set) => ({
  macros: [],
  setMacros: (macros: Macro[]) => set({ macros }),
 
}));
