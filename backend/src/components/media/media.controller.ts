import { Media } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { MediaService } from "./media.service";
import { UploadService } from "./upload.service";
import { UserType } from "../../types/user.type";
import { UpdateMediaDto } from "./media.validation";

interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class MediaController {
  constructor(
    @Inject(() => MediaService) private mediaService: MediaService,
    @Inject(() => UploadService) private uploadService: UploadService
  ) {}

  uploadFile = async (req: any, res: Response, next: NextFunction) => {
    try {
      await this.uploadService.handleUpload(req, res, async () => {
        await this.mediaService.createMedia(req, res, () => {
          res.status(201).json({ data: req.file, message: "created" });
        });
      });
    } catch (error) {
      next(error);
    }
  };

  getAllMedia = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const media = await this.mediaService.findAllMedias(req.user);
      res.status(200).json({ data: media, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  getMediaById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { media_id } = req.params;
      const media = await this.mediaService.findMedia(parseInt(media_id));
      res.status(200).json({ data: media, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  getMediaByFolderId = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { folder_id } = req.params;
      const media = await this.mediaService.findMediaByFolderId(
        parseInt(folder_id),
        req.user
      );
      res.status(200).json({ data: media, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  updateMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const media_id = req.params.media_id;
      const mediaData: UpdateMediaDto = req.body;
      const updatedMedia = await this.mediaService.updateMedia(
        parseInt(media_id),
        mediaData
      );
      res.status(200).json({ data: updatedMedia, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { media_id } = req.params;
      const media = await this.mediaService.findMedia(parseInt(media_id));
      await this.mediaService.deleteMedia(parseInt(media_id)).then(() => {
        this.uploadService.deleteMedia(media);
        res.status(200).json({ message: "deleted" });
      });
    } catch (error) {
      next(error);
    }
  };
}
