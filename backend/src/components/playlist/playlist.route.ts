import { Router } from "express";
import { Container } from "typedi";
import { PlaylistController } from "./playlist.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateDto } from "../../middlewares/validation.middleware";
import { CreatePlaylistDto, UpdatePlaylistDto } from "./playlist.validation";

const router = Router();

const playlistController = Container.get(PlaylistController);

router.post("/", authMiddleware, /* validateDto(CreatePlaylistDto), */ (req, res, next) =>
  playlistController.createPlaylist(req, res, next)
);

router.get("/:playlistId", authMiddleware, (req, res, next) =>
  playlistController.getPlaylistById(req, res, next)
);

router.get("/", authMiddleware, (req, res, next) =>
  playlistController.getAllPlaylists(req, res, next)
);

router.put("/:playlistId", authMiddleware, validateDto(UpdatePlaylistDto), (req, res, next) =>
  playlistController.updatePlaylist(req, res, next)
);

router.delete("/", authMiddleware, (req, res, next) =>
  playlistController.deletePlaylists(req, res, next)
);

export default router;
