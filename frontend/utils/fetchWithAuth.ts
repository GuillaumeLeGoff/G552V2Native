import { useAuthStore } from "~/store/authStore";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { token } = useAuthStore.getState();
  if (!token) {
    throw new Error("No token available");
  }
  console.log("token", url);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    /*  useAuthStore.getState().setToken(null); */
    throw new Error("Failed to fetch");
  }

  return response;
}