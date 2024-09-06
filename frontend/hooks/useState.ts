import { useEffect, useCallback } from "react";
import { UserService } from "../services/user.service";
import { useAuthStore } from "../store/authStore";

export const useUsers = () => {
  const { setUsers, users } = useAuthStore();

  const getAllUsers = useCallback(async () => {
    const users = await UserService.getUsers();
    console.log(users);
    setUsers(users);
  }, [setUsers]);

  useEffect(() => {
    if (users?.length === 0) {
      getAllUsers();
    }
  }, [getAllUsers, users]);

  return { users };
};
