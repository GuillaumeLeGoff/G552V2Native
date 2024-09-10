import { useEffect, useCallback, useState } from "react";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "~/store/userStore";

export const useAuth = () => {
  const { setToken } = useAuthStore();
  const { setUser, user, setUsers, users } = useUserStore();
  const [userSelected, setUserSelected] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = useCallback(async () => {
    const users = await UserService.getUsers();
    if (users) {
      setUsers(users);
    }
  }, [setUsers]);

  const logout = useCallback(async () => {
    await AuthService.logout();
  }, []);

  const login = useCallback(async () => {
    if (userSelected && password) {
      try {
        const token = await AuthService.login(userSelected, password);
        setToken(token);
      } catch (error) {
        setError("Invalid username or password");
      }
    }
  }, [setToken, userSelected, password]); // Ajoutez userSelected et password comme dépendances

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return {
    login,
    logout,
    users,
    setUser,
    userSelected,
    setUserSelected,
    password,
    setPassword,
    error,
  };
};
