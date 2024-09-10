// ~/store/authStore.ts
import { create } from "zustand";

type AuthState = {
  token: string | null;
};

type AuthActions = {
  setToken: (token: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  users: [],
  token: null,


  setToken: (token: string) => {
    set({ token });
  },

  signOut: async () => {
    set({ token: null });
  },
}));
