import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { HttpException } from "../utils/HttpException";

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
    const result = await response.json();
    if (!response.ok) {
      throw new HttpException(result.status, result.message);
    }
    
    return result.data;
  }

  static async logout() {
    const response = await fetch(`${this.API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new HttpException(response.status, `HTTP error ${response.statusText}`);
    }
    return await response.json();
  }
}
