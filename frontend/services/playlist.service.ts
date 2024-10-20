import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "../store/authStore";
import { Playlist } from "~/types/Playlist";

export class PlaylistService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/playlist`;

  static async getPlaylists(): Promise<Playlist[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });

    const result = await response.json();
    return result.data;
  }

  static async getPlaylist(id: number): Promise<Playlist> {
    const response = await fetchWithAuth(`${this.API_URL}/${id}`, {
      method: "GET",
    });
    const result = await response.json();
    return result.data;
  }

  static async createPlaylist(name: string): Promise<Playlist> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }
    const result = await response.json();
    return result.data;
  }

  static async deletePlaylists(ids: number[]): Promise<void> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete playlists");
    }
    const result = await response.json();
    return result.data;
  }
}
