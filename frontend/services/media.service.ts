import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/utils/fetchWithAuth";
import { Media } from "~/types/Media";
import { HttpException } from "~/utils/HttpException";

export class MediaService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/media`;

  static async uploadMedia(formData: FormData): Promise<Media> {
    console.log("uploadMedia");
    console.log("formData", formData);
    const response = await fetchWithAuth(`${this.API_URL}/`, {
      method: "POST",
        body: formData,
      });
      const result = await response.json()


    return result.data;
  }

  static async getAllMedia(): Promise<Media[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async getMediaById(mediaId: number): Promise<Media> {
    const response = await fetchWithAuth(`${this.API_URL}/${mediaId}`, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }

    return result.data;
  }

  static async getMediaByFolderId(folderId: number): Promise<Media[]> {
    const response = await fetchWithAuth(`${this.API_URL}/folder/${folderId}`, {
      method: "GET",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async deleteMedia(mediaIds: number[]): Promise<void> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mediaIds }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
  }
}

export default MediaService;
