import { Folder, Media } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { UserType } from "../../types/user.type";
import { MediaService } from "../media/media.service";
import { FolderService } from "./folder.service";
import { CreateFolderDto } from "./folder.validation";
import { UploadService } from "../media/upload.service";
interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class FolderController {
  constructor(
    @Inject(() => FolderService) private folderService: FolderService,
    @Inject(() => MediaService) private mediaService: MediaService,
    @Inject(() => UploadService) private uploadService: UploadService
  ) {}

  createFolder = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("createFolder", req.body);
      const folder: CreateFolderDto = req.body;
      const user_id = req.user.id;
      const newFolder: Folder = await this.folderService.createFolder(
        folder,
        user_id
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

  getRoot = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user.id;
      const folders: Folder[] = await this.folderService.getRoot(user_id);
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

  deleteFolderAndMedias = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const folderIds: number[] = req.body.folderIds;
      const subFoldersIds: number[] =
        await this.folderService.findAllNestedFolderIds(folderIds);
      const allFoldersIds = [...folderIds, ...subFoldersIds];
      console.log("allFoldersIds", allFoldersIds);
      const medias: Media[] =
        await this.folderService.findMediaByFolderId(allFoldersIds);

      await this.uploadService.deleteMedias(medias);
      await this.folderService.deleteFolder(allFoldersIds);
      await this.mediaService.deleteMedias(medias.map((media) => media.id));

      console.log("medias", medias);
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
