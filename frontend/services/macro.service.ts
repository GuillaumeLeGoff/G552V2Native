import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { fetchWithAuth } from "~/store/authStore";
import { Macro } from "~/types/Macro";

export class MacroService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/macro`;

  static async getMacro(): Promise<Macro[]> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "GET",
    });

    const result = await response.json();
    return result.data;
  }

  static async getMacroById(macroId: number | null): Promise<Macro | null> {
    const response = await fetchWithAuth(`${this.API_URL}/${macroId}`, {
      method: "GET",
    });

    const result = await response.json();
    return result.data;
  }

  static async createMacro(
    name: string,
    parent_id: number | null
  ): Promise<Macro> {
    const response = await fetchWithAuth(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, parent_id }),
    });
    if (!response.ok) {
      throw new Error("Failed to create macro");
    }
    const result = await response.json();
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
    if (!response.ok) {
      throw new Error("Failed to delete macros");
    }
    const result = await response.json();
    return result.data;
  }
}
