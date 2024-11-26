import { PrismaClient, Playlist } from "@prisma/client";
import { Service } from "typedi";
import { CreatePlaylistDto, UpdatePlaylistDto } from "./playlist.validation";
import { UserType } from "../../types/user.type";

const prisma = new PrismaClient();

@Service()
export class PlaylistService {
  async getAllPlaylists(user: UserType): Promise<Playlist[]> {
    const playlists = await prisma.playlist.findMany({
      where: {
        user_id: user.id,
      },
    });
    return playlists;
  }

  async getPlaylistById(id: number): Promise<Playlist | null> {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        medias: {
          include: {
            media: true, // Assurez-vous que le modèle Prisma inclut une relation 'media'
          },
          orderBy: {
            media_pos_in_playlist: "asc", // Tri par position dans la playlist
          },
        },
      },
    });
    return playlist;
  }

  async createPlaylist(
    playlistData: CreatePlaylistDto,
    user: UserType
  ): Promise<Playlist> {
    const playlist = await prisma.playlist.create({
      data: {
        name: playlistData.name,
        user_id: user.id,
      },
    });
    return playlist;
  }

  async updatePlaylist(
    id: number,
    playlistData: UpdatePlaylistDto
  ): Promise<Playlist | null> {
    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        name: playlistData.name,
      },
    });
    return playlist;
  }

  async deletePlaylists(ids: number[]): Promise<void> {
    await prisma.playlist.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
