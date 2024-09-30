import { PROTOCOL, IP_ADDRESS, API_PORT } from "@env";
import { fetchWithAuth } from "~/store/authStore";
import { Folder } from "~/types/Folder";

export class FolderService {
  static API_URL = `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/folder`;


}
