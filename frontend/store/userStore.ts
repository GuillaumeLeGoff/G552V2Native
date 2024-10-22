import { create } from "zustand";
import { User } from '../types/User';

type UserState = {
  users: User[] | null;
  user: string | null;
};

type UserActions = {
  setUsers: (users: User[]) => void;
  setUser: (user: string) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  users: [],
  user: null,
  setUsers: (users: User[]) => {
    set({ users });
  },
  setUser: (user: string) => {
    set({ user });    
  },
  resetUser: () => set({ users: [], user: null }), // Ajout d'une méthode pour réinitialiser les utilisateurs
}));
