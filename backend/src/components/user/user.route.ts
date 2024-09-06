import { Router } from "express";
import { Container } from "typedi";
import { UserController } from "./user.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateUserDto, UpdateUserDto } from "./user.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { extractUser } from "../../middlewares/extractUser.middleware";
const router = Router();

const userController = Container.get(UserController);
router.post("/", validateDto(CreateUserDto), (req, res, next) =>
  userController.createUser(req, res, next)
);

router.get("/getUserById", extractUser, authMiddleware, (req, res, next) =>
  userController.getUserById(req, res, next)
);

router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));

router.put(
  "/",
  extractUser,
  authMiddleware,
  validateDto(UpdateUserDto),
  (req, res, next) => userController.updateUser(req, res, next)
);

router.delete("/", extractUser, authMiddleware, (req, res, next) =>
  userController.deleteUser(req, res, next)
);

export default router;
