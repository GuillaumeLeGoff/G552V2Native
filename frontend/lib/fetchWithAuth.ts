import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authStorage = await AsyncStorage.getItem('auth-storage');
  if (!authStorage) {
    throw new Error("No auth storage available");
  }

  const { state: { token } } = JSON.parse(authStorage); // Récupérer le token depuis l'objet JSON
  console.log("token", token);
  console.log("url", url);
  
  if (!token) {
    throw new Error("No token available");
  }


  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};