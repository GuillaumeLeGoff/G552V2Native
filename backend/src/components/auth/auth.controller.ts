import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { AuthService } from "./auth.service";
import {

  LoginUserDto,
  RegisterDto,
  ChangePasswordDto
} from "./auth.validation";
import { UserType } from "../../types/user.type";
import { log } from "console";
interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class AuthController {
  constructor(@Inject(() => AuthService) private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: RegisterDto = req.body;
      const user: User = await this.authService.register(userData);
      res
        .status(201)
        .json({ data: user, message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials: LoginUserDto = req.body;
      const token = await this.authService.login(credentials);
      res.status(200).json({ data: token, message: "Logged in successfully" });
    } catch (error) {
      log
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.logout();
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword }: ChangePasswordDto = req.body;
      const userId = req.user.id;
      await this.authService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  };
}
