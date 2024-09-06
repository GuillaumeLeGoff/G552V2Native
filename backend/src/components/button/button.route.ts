import { Router } from "express";
import { Container } from "typedi";
import { ButtonController } from "./button.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { CreateButtonDto } from "./button.validation";
import { validateDto } from "../../middlewares/validation.middleware";

const router = Router();

const buttonController = Container.get(ButtonController);

router.post("/", authMiddleware,validateDto(CreateButtonDto), (req, res, next) =>
  buttonController.createButton(req, res, next)
);

router.get("/:buttonId", authMiddleware, (req, res, next) =>
  buttonController.getButtonById(req, res, next)
);

router.get("/", authMiddleware, (req, res, next) =>
  buttonController.getAllButtons(req, res, next)
);

router.put("/:buttonId", authMiddleware, validateDto(CreateButtonDto), (req, res, next) =>
  buttonController.updateButton(req, res, next)
);

router.delete("/:buttonId", authMiddleware, (req, res, next) =>
  buttonController.deleteButton(req, res, next)
);

export default router;
