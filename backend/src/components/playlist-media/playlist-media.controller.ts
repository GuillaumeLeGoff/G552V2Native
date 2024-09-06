import { PlaylistMedia } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { PlaylistMediaService } from "./playlist-media.service";
import { CreatePlaylistMediaDto, UpdatePlaylistMediaDto } from "./playlistMedia.validation";
import { UserType } from "../../types/user.type";

interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class PlaylistMediaController {
  constructor(
    @Inject(() => PlaylistMediaService)
    private playlistMediaService: PlaylistMediaService
  ) {}

  createPlaylistMedia = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistMediaData: CreatePlaylistMediaDto = req.body
      const newPlaylistMedia: PlaylistMedia =
        await this.playlistMediaService.createPlaylistMedia(playlistMediaData);
      res.status(201).json({ data: newPlaylistMedia, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  getPlaylistMediaById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistMediaId: number = parseInt(req.params.playlistMediaId);
      const playlistMedia: PlaylistMedia | null =
        await this.playlistMediaService.getPlaylistMediaById(playlistMediaId);
      if (!playlistMedia) {
        res.status(404).json({ message: "PlaylistMedia not found" });
      } else {
        res.status(200).json({ data: playlistMedia, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  getAllPlaylistMedias = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistMedias: PlaylistMedia[] =
        await this.playlistMediaService.getAllPlaylistMedias(req.user);
      res.status(200).json({ data: playlistMedias, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  updatePlaylistMedia = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistMediaId: number = parseInt(req.params.playlistMediaId);
      const playlistMediaData: UpdatePlaylistMediaDto = req.body
      const updatedPlaylistMedia: PlaylistMedia | null =
        await this.playlistMediaService.updatePlaylistMedia(
          playlistMediaId,
          playlistMediaData
        );
      if (!updatedPlaylistMedia) {
        res.status(404).json({ message: "PlaylistMedia not found" });
      } else {
        res
          .status(200)
          .json({ data: updatedPlaylistMedia, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deletePlaylistMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const playlistMediaId: number = parseInt(req.params.playlistMediaId);
      const deletedPlaylistMedia: PlaylistMedia | null =
        await this.playlistMediaService.deletePlaylistMedia(playlistMediaId);
      if (!deletedPlaylistMedia) {
        res.status(404).json({ message: "PlaylistMedia not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };
}
