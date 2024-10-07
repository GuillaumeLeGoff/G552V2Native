import { Router } from "express";
import { Container } from "typedi";
import { MediaController } from "./media.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateMediaDto, UpdateMediaDto } from "./media.validation";
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // Configurez multer pour gérer les fichiers

const router = Router();
const mediaController = Container.get(MediaController);

router.post(
  "/",
  authMiddleware,
  validateDto(CreateMediaDto),
  mediaController.uploadFile
);

router.get("/", authMiddleware, mediaController.getAllMedia);

router.get("/:media_id", authMiddleware, mediaController.getMediaById);

router.get(
  "/folder/:folder_id",
  authMiddleware,
  mediaController.getMediaByFolderId
);

router.put(
  "/:media_id",
  validateDto(UpdateMediaDto),
  authMiddleware,
  mediaController.updateMedia
);

router.delete("/", authMiddleware, mediaController.deleteMedia);

router.post("/upload", upload.single("file"), mediaController.uploadFile);

export default router;
