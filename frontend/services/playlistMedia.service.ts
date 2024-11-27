import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { fetchWithAuth } from "~/utils/fetchWithAuth";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import { HttpException } from "~/utils/HttpException";

export class PlaylistMediaService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/playlist-media`;

  static async createPlaylistMedia(playlistMedia: any) {
    const response = await fetchWithAuth(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playlistMedia),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async updatePlaylistMedia(
    playlistMedia: PlaylistMedia,

  ) {
    const response = await fetchWithAuth(this.API_URL + "/" + playlistMedia.id, {
      method: "PUT",
      body: JSON.stringify(playlistMedia),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async deletePlaylistMedias(playlistMediaIds: number[]) {
    const response = await fetchWithAuth(this.API_URL, {
      method: "DELETE",
      body: JSON.stringify({ ids: playlistMediaIds }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async updateMediaOrder(updatedOrder: PlaylistMedia[]) {
    try {
      const response = await fetchWithAuth(this.API_URL + "/update-order", {
        method: "POST",
        body: JSON.stringify({
          medias: updatedOrder.map((media) => ({
            id: media.id,
            media_pos_in_playlist: media.media_pos_in_playlist,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new HttpException(result.status, result.message);
      }
      return result.data;
    } catch (error) {
      console.error("Failed to update media order", error);
      throw error;
    }
  }
}
