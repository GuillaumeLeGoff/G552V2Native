import { useEffect, useCallback, useState } from "react";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "~/store/userStore";
import { router } from "expo-router";
import { catchError } from "~/utils/catchError";
import { HttpException } from "../utils/HttpException";

export const useAuth = () => {
  const { setUser, setUsers, users } = useUserStore();
  const { token, setToken, setUserConnected, user } = useAuthStore();

  const [userSelected, setUserSelected] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  const getAllUsers = useCallback(async () => {
    const [error, users] = await catchError(UserService.getUsers());

    if (error) {
      console.log(error);
      setError(error.message);
    } else if (users) {
      console.log(users);
      setUsers(users);
    }
  }, [setUsers, setError]);

  const logout = async () => {
    const [error] = await catchError(AuthService.logout());
    if (error) {
      setError(error.message);
    } else {
      setToken(null);
      setUserConnected(null);
    }
  };

  const login = useCallback(async () => {
    if (userSelected && password) {
      const [error, newToken] = await catchError(
        AuthService.login(userSelected, password)
      );
      if (error) {
        if (error.status === 409) {
          setIsAlreadyConnected(true);
        }
        setAuthError(error.message);
      } else {
        setToken(newToken);
        setAuthError(null);
        setIsAlreadyConnected(false);
        setUser(userSelected);
        setUserConnected(userSelected);
        router.push("/playlists");
        return true;
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
      setShakeKey((prev) => prev + 1);
      return false;
    } else {
      return await login();
    }
  }, [password, userSelected, login, setPasswordError, setUsernameError]);

  const disconnectUser = useCallback(async () => {
    const [error] = await catchError(AuthService.logout());
    if (error) {
      setError(error.message);
    } else {
      setUserSelected(null);
      setPassword(null);
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
    user,
    isAlreadyConnected,
    setIsAlreadyConnected,
    disconnectUser,
    token,
    shakeKey,
    authError,
  };
};
