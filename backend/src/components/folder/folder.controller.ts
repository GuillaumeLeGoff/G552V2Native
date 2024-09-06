import { Folder } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { FolderService } from "./folder.service";
import { CreateFolderDto } from "./folder.validation";
import { UserType } from "../../types/user.type";

interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class FolderController {
  constructor(
    @Inject(() => FolderService) private folderService: FolderService
  ) {}

  createFolder = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const folder: CreateFolderDto = req.body;
      const user_id = req.user.id;
      const newFolder: Folder = await this.folderService.createFolder(
        folder, user_id
      );
      res.status(201).json({ data: newFolder, message: "created" });
    } catch (error) {
      console.log(error);

      next(error);
    }
  };

  getFolderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folderId: number = parseInt(req.params.folder_id);

      const folder: Folder | null = await this.folderService.getFolderById(
        folderId
      );
      if (!folder) {
        res.status(404).json({ message: "Folder not found" });
      } else {
        res.status(200).json({ data: folder, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  getAllFolders = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user.id;
      console.log(user_id);
      
      const folders: Folder[] = await this.folderService.getAllFolders(user_id);
      res.status(200).json({ data: folders, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  updateFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folderId: number = parseInt(req.params.folder_id);
      const folderData: CreateFolderDto = req.body;
      const updatedFolder: Folder | null =
        await this.folderService.updateFolder(folderId, folderData);
      if (!updatedFolder) {
        res.status(404).json({ message: "Folder not found" });
      } else {
        res.status(200).json({ data: updatedFolder, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const folderId: number = parseInt(req.params.folder_id);
      const deletedFolder: Folder | null =
        await this.folderService.deleteFolder(folderId);
      if (!deletedFolder) {
        res.status(404).json({ message: "Folder not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };
}
