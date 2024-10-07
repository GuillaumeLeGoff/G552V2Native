import { Router } from "express";
import { Container } from "typedi";
import { FolderController } from "./folder.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { extractUser } from "../../middlewares/extractUser.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateFolderDto } from "./folder.validation";

const router = Router();
const folderController = Container.get(FolderController);

router.post(
  "/",
  authMiddleware,
  /* validateDto(CreateFolderDto), */
  (req, res, next) => folderController.createFolder(req, res, next)
);

router.get("/", extractUser, authMiddleware, (req, res, next) =>
  folderController.getRoot(req, res, next)
);

router.get("/:folder_id", authMiddleware, (req, res, next) =>
  folderController.getFolderById(req, res, next)
);

router.put(
  "/:folder_id",
  authMiddleware,
  validateDto(CreateFolderDto),
  (req, res, next) => folderController.updateFolder(req, res, next)
);

router.delete("/", authMiddleware, (req, res, next) =>
  folderController.deleteFolderAndMedias(req, res, next)
);

export default router;
