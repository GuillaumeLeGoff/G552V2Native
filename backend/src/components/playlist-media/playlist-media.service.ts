import { PrismaClient, PlaylistMedia } from "@prisma/client";
import { Service } from "typedi";
import {
  CreatePlaylistMediaDto,
  UpdatePlaylistMediaDto,
} from "./playlistMedia.validation";
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

  async deletePlaylistMedia(ids: number[]): Promise<boolean> {
    await prisma.playlistMedia.deleteMany({
      where: { id: { in: ids } },
    });
    return true;
  }

  async createPlaylistMedia(
    playlistMediaDataArray: CreatePlaylistMediaDto[]
  ): Promise<PlaylistMedia[]> {
    const newPlaylistMedias = await Promise.all(
      playlistMediaDataArray.map(async (data) => {
        return await prisma.playlistMedia.create({
          data: {
            media_id: data.media_id,
            playlist_id: data.playlist_id,
            media_dur_in_playlist: data.media_dur_in_playlist,
            media_pos_in_playlist: data.media_pos_in_playlist,
          },
        });
      })
    );
    return newPlaylistMedias;
  }

  async updateMediaOrder(
    medias: { id: number; media_pos_in_playlist: number }[]
  ) {
    console.log(medias);
    for (const media of medias) {
      await prisma.playlistMedia.update({
        where: { id: media.id },
        data: {
          media_pos_in_playlist: media.media_pos_in_playlist,
        },
      });
    }
  }
}
