import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/store/authStore";
import { Folder } from "~/types/Folder";

export class FolderService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/folder`;

  static async getFolders(folder_id: number): Promise<Folder[]> {
    const response = await fetchWithAuth(this.API_URL + "/" + folder_id, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to get folders");
    }
    const result = await response.json();
    return result.data;
  }
}
