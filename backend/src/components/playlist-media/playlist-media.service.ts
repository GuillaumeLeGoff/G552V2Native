import { PrismaClient, PlaylistMedia } from "@prisma/client";
import { Service } from "typedi";
import { CreatePlaylistMediaDto, UpdatePlaylistMediaDto } from "./playlistMedia.validation";
import { UserType } from "../../types/user.type";

const prisma = new PrismaClient();

@Service()
export class PlaylistMediaService {
  async getAllPlaylistMedias(user: UserType): Promise<PlaylistMedia[]> {
    const playlistMedias = await prisma.playlistMedia.findMany({
      where: {
        playlist: {
          user_id: user.id,
        },
      },
    });
    return playlistMedias;
  }

  async getPlaylistMediaById(id: number): Promise<PlaylistMedia | null> {
    const playlistMedia = await prisma.playlistMedia.findUnique({
      where: { id },
    });
    return playlistMedia;
  }

  async createPlaylistMedia(
    playlistMediaData: CreatePlaylistMediaDto,
  ): Promise<PlaylistMedia> {
    const playlistMedia = await prisma.playlistMedia.create({
      data: {
        media_id: playlistMediaData.media_id,
        playlist_id: playlistMediaData.playlist_id,
        media_dur_in_playlist: playlistMediaData.media_dur_in_playlist,
        media_pos_in_playlist: playlistMediaData.media_pos_in_playlist,
      },
    });
    return playlistMedia;
  }

  async updatePlaylistMedia(
    id: number,
    playlistMediaData: UpdatePlaylistMediaDto
  ): Promise<PlaylistMedia | null> {
    const playlistMedia = await prisma.playlistMedia.update({
      where: { id },
      data: {
        media_dur_in_playlist: playlistMediaData.media_dur_in_playlist,
        media_pos_in_playlist: playlistMediaData.media_pos_in_playlist,
      },
    });
    return playlistMedia;
  }

  async deletePlaylistMedia(id: number): Promise<PlaylistMedia | null> {
    const playlistMedia = await prisma.playlistMedia.delete({
      where: { id },
    });
    return playlistMedia;
  }
}
