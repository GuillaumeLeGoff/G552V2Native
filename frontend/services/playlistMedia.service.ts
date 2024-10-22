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

  static async updatePlaylistMedia(playlistMedia: PlaylistMedia) {
    const response = await fetchWithAuth(this.API_URL, {
      method: "PUT",
      body: JSON.stringify(playlistMedia),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }
}
