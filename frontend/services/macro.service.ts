import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { fetchWithAuth } from "~/utils/fetchWithAuth";
import { Macro } from "~/types/Macro";
import { HttpException } from "~/utils/HttpException";

export class MacroService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/macro`;

  static async getMacro(): Promise<Macro[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });

    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }


  static async deleteMacros(macroIds: number[]): Promise<void> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ macroIds }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    return result.data;
  }

  static async updateMacros(macroButtonId: number, playlistId: number): Promise<Macro> {
    const response = await fetchWithAuth(`${this.API_URL}/${macroButtonId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playlist_id: playlistId }), // Conversion en snake_case
    });
       const result = await response.json();
       if (!response.ok) {
        throw new HttpException(result.status, result.message);
       }
       return result.data;
  }



}
