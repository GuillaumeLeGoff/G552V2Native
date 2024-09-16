import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";

export class AuthService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/auth`;
  
  static async login(username: string, password: string) {
    const response = await fetch(`${this.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("User already connected", { cause: 409 });
      }
      throw new Error(`HTTP error! status: ${response.status}`, {
        cause: response.status,
      });
    }

    const result = await response.json();
    console.log(result);
    return { token: result.data, message: result.message };
  }

  static async logout() {
    const response = await fetch(`${this.API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
}
