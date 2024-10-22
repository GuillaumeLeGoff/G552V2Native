import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/utils/fetchWithAuth";
import { Folder } from "~/types/Folder";
import { HttpException } from "~/utils/HttpException";

export class FolderService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/folder`;

  static async getRoot(): Promise<Folder | null> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data[0];
  }

  static async getFolderById(folderId: number | null): Promise<Folder | null> {
    const response = await fetchWithAuth(`${this.API_URL}/${folderId}`, {
      method: "GET",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async deleteFolders(folderIds: number[]): Promise<void> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderIds }),
    });
    const result = await response.json();
    if (!response.ok) { 
      throw new HttpException(result.status, result.message);
    }

    return result.data;
  }
}
