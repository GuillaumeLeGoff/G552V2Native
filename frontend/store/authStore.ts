import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: string | null) => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { token } = useAuthStore.getState();
  if (!token) {
    throw new Error("No token available");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    console.log("response", response);
    /*  useAuthStore.getState().setToken(null); */
    throw new Error("Failed to fetch");
  }

  return response;
}
