import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { UserType } from "../../types/user.type";

interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class UserController {
  constructor(@Inject(() => UserService) private userService: UserService) {}
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const newUser: User = await this.userService.createUser(userData);
      res.status(201).json({ data: newUser, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const user: User | null = await this.userService.findUserById(userId);
      if (user) {
        res.status(200).json({ data: user, message: "found" });
      } else {
        res.status(404).json({ message: "user not found" });
      }
    } catch (error) {
      next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users: User[] = await this.userService.findUsers();
      res.status(200).json({ data: users, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      const userData = req.body;
      const updateUser: User = await this.userService.updateUser(
        userId,
        userData
      );
      res.status(200).json({ data: updateUser, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      await this.userService.deleteUser(userId);
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
