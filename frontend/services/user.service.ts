import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
export class UserService {
  static async getUsers() {
    try {
      const apiUrl = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/user`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const user = result.data;
      return user;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }
  }
}
