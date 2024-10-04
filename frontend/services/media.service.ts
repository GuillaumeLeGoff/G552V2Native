import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/store/authStore";
import { Media } from "~/types/Media";

export class MediaService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/media`;

  static async uploadMedia(formData: FormData): Promise<Media> {
    try {
      const response = await fetchWithAuth(`${this.API_URL}/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", errorText);
        throw new Error("Failed to upload media");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    }
  }

  static async getAllMedia(): Promise<Media[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const result = await response.json();
    return result.data;
  }

  static async getMediaById(mediaId: number): Promise<Media> {
    const response = await fetchWithAuth(`${this.API_URL}/${mediaId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media with ID ${mediaId}`);
    }

    const result = await response.json();
    return result.data;
  }

  static async getMediaByFolderId(folderId: number): Promise<Media[]> {
    const response = await fetchWithAuth(`${this.API_URL}/folder/${folderId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media for folder ID ${folderId}`);
    }

    const result = await response.json();
    return result.data;
  }

  static async updateMedia(mediaId: number, updateData: any): Promise<Media> {
    const response = await fetchWithAuth(`${this.API_URL}/${mediaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update media with ID ${mediaId}`);
    }

    const result = await response.json();
    return result.data;
  }

  static async deleteMedia(mediaId: number): Promise<void> {
    const response = await fetchWithAuth(`${this.API_URL}/${mediaId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete media with ID ${mediaId}`);
    }
  }
}

export default MediaService;
