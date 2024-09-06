// ~/store/authStore.ts

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  users: User[] | null;
  session: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setUsers: (users: User[]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  users: [],
  session: null,
  isLoading: true,
  isInitialized: false,

  setUsers: (users: User[]) => {
    set({ users });
  },

  signIn: async (token: string) => {
    console.log("Connexion avec le token:", token);
    await AsyncStorage.setItem("userToken", token);
    set({ session: token, isLoading: false });
  },

  signOut: async () => {
    console.log("Déconnexion");
    await AsyncStorage.removeItem("userToken");
    set({ session: null, isLoading: false });
  },

  initializeAuth: async () => {
    console.log("Initialisation de l'authentification");
    const token = await AsyncStorage.getItem("userToken");
    console.log("Token récupéré:", token);
    set({ session: token, isLoading: false, isInitialized: true });
  },
}));
