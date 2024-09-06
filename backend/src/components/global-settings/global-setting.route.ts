import { Router } from "express";
import { Container } from "typedi";
import { GlobalSettingController } from "./global-setting.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateGlobalSettingDto } from "./global-setting.validation";

const router = Router();

const globalSettingController = Container.get(GlobalSettingController);

router.post("/", authMiddleware, validateDto(CreateGlobalSettingDto), (req, res, next) =>
  globalSettingController.createGlobalSetting(req, res, next)
);

router.get("/:globalSettingId", authMiddleware, (req, res, next) =>
  globalSettingController.getGlobalSettingById(req, res, next)
);

router.get("/", authMiddleware, (req, res, next) =>
  globalSettingController.getGlobalSettings(req, res, next)
);

router.put("/:globalSettingId", authMiddleware, validateDto(CreateGlobalSettingDto), (req, res, next) =>
  globalSettingController.updateGlobalSetting(req, res, next)
);

router.delete("/:globalSettingId", authMiddleware, (req, res, next) =>
  globalSettingController.deleteGlobalSetting(req, res, next)
);

export default router;