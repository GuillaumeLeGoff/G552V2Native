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
      console.log(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    const token = result.data;
    return token;
  }
  static async logout() {
    const response = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    return result;
  }
}
