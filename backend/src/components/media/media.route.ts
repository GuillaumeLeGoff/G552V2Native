import { Router } from "express";
import { Container } from "typedi";
import { MediaController } from "./media.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateMediaDto, UpdateMediaDto } from "./media.validation";

const router = Router();
const mediaController = Container.get(MediaController);

router.post("/", authMiddleware, validateDto(CreateMediaDto) ,mediaController.uploadFile);

router.get("/", authMiddleware, mediaController.getAllMedia);

router.get("/:media_id", authMiddleware, mediaController.getMediaById);

router.put("/:media_id", validateDto(UpdateMediaDto), authMiddleware, mediaController.updateMedia);

router.delete(
  "/:media_id",
  authMiddleware,
  mediaController.deleteMedia
);

export default router;
