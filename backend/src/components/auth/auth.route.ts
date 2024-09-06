import { Router } from "express";
import { Container } from "typedi";
import { AuthController } from "./auth.controller";

import {  ChangePasswordDto, LoginUserDto, RegisterDto } from "./auth.validation";
import { validateDto } from "../../middlewares/validation.middleware";
import { extractUser } from "../../middlewares/extractUser.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const authController = Container.get(AuthController);

router.post("/login", validateDto(LoginUserDto), (req, res, next) =>
  authController.login(req, res, next)
);

router.post("/register", validateDto(RegisterDto), (req, res, next) =>
  authController.register(req, res, next)
);

router.post("/logout", (req, res, next) =>
  authController.logout(req, res, next)
);

router.post("/change-password", authMiddleware, extractUser, validateDto(ChangePasswordDto), (req, res, next) =>
  authController.changePassword(req, res, next)
);

export default router;
