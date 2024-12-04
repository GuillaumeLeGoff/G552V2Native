import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/utils/fetchWithAuth";
import { Playlist } from "~/types/Playlist";
import { HttpException } from "~/utils/HttpException";

export class PlaylistService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/playlist`;

  static async getPlaylists(): Promise<Playlist[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async getPlaylist(id: number): Promise<Playlist> {
    const response = await fetchWithAuth(`${this.API_URL}/${id}`, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async updatePlaylist(playlist: Playlist): Promise<Playlist> {
    const response = await fetchWithAuth(`${this.API_URL}/${playlist.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playlist),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }
}
