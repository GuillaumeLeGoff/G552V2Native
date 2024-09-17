import { useEffect, useCallback, useState } from "react";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "~/store/userStore";

export const useAuth = () => {
  const { token, setToken } = useAuthStore();
  const { setUser, user, setUsers, users } = useUserStore();
  const [userSelected, setUserSelected] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const getAllUsers = useCallback(async () => {
    const users = await UserService.getUsers();
    if (users) {
      setUsers(users);
    }
  }, [setUsers]);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setToken(null);
  }, [setToken]);

  const login = useCallback(async () => {
    if (userSelected && password) {
      try {
        const { token: newToken, message } = await AuthService.login(userSelected, password);
        setToken(newToken);
        setError(null);
        setIsAlreadyConnected(false);
        console.log(message);
        return true;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.cause);
          if (error.cause === 409) {
            setIsAlreadyConnected(true);
          } else {
            setError("Invalid username or password");
          }
        }
        return false;
      }
    }
    return false;
  }, [setToken, userSelected, password]);

  const handleLogin = useCallback(async () => {
    let hasError = false;
    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }
    if (!userSelected) {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }

    if (hasError) {
      setShakeKey(prev => prev + 1); 
      return false; 
    } else {
      return await login();
    }
  }, [password, userSelected, login, setPasswordError, setUsernameError]);

  const disconnectUser = useCallback(async () => {
    try {
      await AuthService.logout();
      setUserSelected(null);
      setPassword(null);
    } catch (error) {
      console.error("Failed to disconnect user:", error);
      setError("Failed to disconnect user. Please try again.");
    }
  }, [userSelected]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return {
    handleLogin,
    login,
    logout,
    users,
    setUser,
    userSelected,
    setUserSelected,
    password,
    setPassword,
    error,
    setError,
    usernameError,
    setUsernameError,
    passwordError,
    setPasswordError,
    isAlreadyConnected,
    setIsAlreadyConnected,
    disconnectUser,
    token,
    shakeKey
  };
};
