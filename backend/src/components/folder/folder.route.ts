import { Router } from "express";
import { Container } from "typedi";
import { FolderController } from "./folder.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { extractUser } from "../../middlewares/extractUser.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreateFolderDto } from "./folder.validation";



const router = Router();
const folderController = Container.get(FolderController);

router.post("/", authMiddleware, validateDto(CreateFolderDto), folderController.createFolder);

router.get("/", extractUser, authMiddleware, folderController.getAllFolders);

router.get("/:folder_id", authMiddleware, folderController.getFolderById);

router.put("/:folder_id", authMiddleware ,validateDto(CreateFolderDto), folderController.updateFolder);

router.delete("/:folder_id", authMiddleware, folderController.deleteFolder);

export default router;
