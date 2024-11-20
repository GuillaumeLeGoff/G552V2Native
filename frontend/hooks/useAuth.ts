import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "~/store/userStore";
import { catchError } from "~/utils/catchError";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const { users, setUser, setUsers  } = useUserStore();
  const { token, user, setToken, setUserConnected } = useAuthStore();

  const [userSelected, setUserSelected] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [isAlreadyConnectedOpen, setIsAlreadyConnectedOpen] = useState(false);
  const [forgotPasswordIsOpen, setForgotPasswordIsOpen] = useState(false);

  const [shakeKey, setShakeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getUsers = useCallback(async () => {
    const [error, users] = await catchError(UserService.getUsers());

    if (error) {
    } else if (users) {
      setUsers(users);
    }
  }, [setUsers]);

  const logout = async () => {
    const [error] = await catchError(AuthService.logout());
    if (error) {
     
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
          setIsAlreadyConnectedOpen(true);
        }
        setAuthError(error.message);
      } else {
        setToken(newToken);
        setAuthError(null);
        setIsAlreadyConnectedOpen(false);
        setUser(userSelected);
        setUserConnected(userSelected);
        router.push("/playlists");
        return true;
      }
    }
    return false;
  }, [setToken, userSelected, password]);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      return false;
    } else {
      await login();
      setIsLoading(false);
      return true;
    }
  }, [password, userSelected, login, setPasswordError, setUsernameError]);

  const handleDisconnectUser = useCallback(async () => {
    await logout();
    await login();
    setUserSelected(null);
    setPassword(null);
  }, [logout]);

  useEffect(() => {
    console.log("useEffect");
    getUsers();
  }, []);

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
    usernameError,
    setUsernameError,
    passwordError,
    setPasswordError,
    user,
    isAlreadyConnectedOpen,
    setIsAlreadyConnectedOpen,
    handleDisconnectUser,
    token,
    shakeKey,
    authError,
    forgotPasswordIsOpen,
    setForgotPasswordIsOpen,
    isLoading,
    setIsLoading,
    showPassword,
    setShowPassword,
  };
};
