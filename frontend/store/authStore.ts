import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LogOut } from 'lucide-react-native'

interface AuthState {
  token: string | null
  setToken: (token: string | null) => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
  
)

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
    useAuthStore.getState().setToken(null);
    throw new Error("Failed to fetch");

  }

  return response;
};
