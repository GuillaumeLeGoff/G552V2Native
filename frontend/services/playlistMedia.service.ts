import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { fetchWithAuth } from "~/store/authStore";
import { PlaylistMedia } from "~/types/PlaylistMedia";

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
    return response.json();
  }

  static async updatePlaylistMedia(playlistMedia: PlaylistMedia) {
    const response = await fetchWithAuth(this.API_URL, {
      method: "PUT",
      body: JSON.stringify(playlistMedia),
    });
    return response.json();
  }
}
