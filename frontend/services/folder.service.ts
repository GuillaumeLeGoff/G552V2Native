import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/store/authStore";
import { Folder } from "~/types/Folder";

export class FolderService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/folder`;

  static async getFolders(): Promise<Folder[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });

    const result = await response.json();
    return result.data;
  }

  static async createFolder(
    name: string,
    parent_id: number | null
  ): Promise<Folder> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, parent_id }),
    });
    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }
    const result = await response.json();
    return result.data;
  }

  static async deleteFolders(folderIds: number[]): Promise<void> {
    console.log("folderIds");
    const response = await fetchWithAuth(this.API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderIds }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete folders");
    }
    const result = await response.json();
    return result.data;
  }
}
