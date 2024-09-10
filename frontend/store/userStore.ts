import { create } from "zustand";

type UserState = {
  users: User[] | null;
  user: User | null;
};

type UserActions = {
  setUsers: (users: User[]) => void;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  users: [],
  user: null,
  setUsers: (users: User[]) => {
    set({ users });
  },
  setUser: (user: User) => {
    set({ user });
  },
}));
