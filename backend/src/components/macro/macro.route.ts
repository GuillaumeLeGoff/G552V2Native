import { Router } from "express";
import { Container } from "typedi";
import { MacroController } from "./macro.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateMacroDto, UpdateMacroDto } from "./macro.validation";

const router = Router();

const macroController = Container.get(MacroController);

router.post(
  "/",
  authMiddleware,
  validateDto(CreateMacroDto),
  (req, res, next) => macroController.createMacro(req, res, next)
);

router.get("/", authMiddleware, (req, res, next) =>
  macroController.findAllMacros(req, res, next)
);

router.get("/:button_id", authMiddleware, (req, res, next) =>
  macroController.findMacro(req, res, next)
);

router.put("/:buttonId", authMiddleware, validateDto(UpdateMacroDto), (req, res, next) =>
  macroController.updateMacro(req, res, next)
);

router.delete("/:button_id", authMiddleware, (req, res, next) =>
  macroController.deleteMacro(req, res, next)
);

export default router;
