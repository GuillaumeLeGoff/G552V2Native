import { PrismaClient, Folder, Media } from "@prisma/client";
import { Service } from "typedi";
import { CreateFolderDto } from "./folder.validation";

const prisma = new PrismaClient();

@Service()
export class FolderService {
  async getRoot(user_id: number): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { user_id, parent_id: null, name: "root" },
      include: { media: true, subFolders: true },
    });
    return folders;
  }

  async getFolderById(id: number): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: { media: true, subFolders: true },
    });
    return folder;
  }

  async createFolder(
    folderData: CreateFolderDto,
    user_id: number
  ): Promise<Folder> {
    const path = await this.generatePath(folderData.name, folderData.parent_id);

    const folder = await prisma.folder.create({
      data: {
        name: folderData.name,
        user_id: user_id,
        parent_id: folderData.parent_id ? folderData.parent_id : null,
        path: path,
      },
    });

    return folder;
  }

  async updateFolder(
    id: number,
    folderData: CreateFolderDto
  ): Promise<Folder | null> {
    const path = await this.generatePath(folderData.name, folderData.parent_id);

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        name: folderData.name,
        parent_id: folderData.parent_id ? folderData.parent_id : null,
        path: path,
      },
    });

    return folder;
  }

  private async generatePath(name: string, parentId?: number): Promise<string> {
    let path = name;
    let currentParentId = parentId;

    while (currentParentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: currentParentId },
      });

      if (parentFolder) {
        path = `${parentFolder.name}/${path}`;
        currentParentId = parentFolder.parent_id;
      } else {
        break;
      }
    }

    return path;
  }
  async findMediaByFolderId(folderIds: number[]): Promise<Media[]> {
    const medias = await prisma.media.findMany({
      where: { folder_id: { in: folderIds } },
    });
    return medias;
  } 
  async findAllNestedFolders(folderIds: number[]): Promise<Folder[]> {
    let allFolders: Folder[] = [];
    let currentLevelFolders = await prisma.folder.findMany({
      where: { parent_id: { in: folderIds } },
      include: { media: true, subFolders: true },
    });
    while (currentLevelFolders.length > 0) {
      const nextLevelFolderIds = currentLevelFolders.map((folder) => folder.id);
      currentLevelFolders = await prisma.folder.findMany({
        where: { parent_id: { in: nextLevelFolderIds } },
        include: { media: true, subFolders: true },
      });
      allFolders = allFolders.concat(currentLevelFolders);
    }
    allFolders = allFolders.concat(currentLevelFolders);
    return allFolders;
  }
  async deleteFolder(folderIds: number[]): Promise<Folder | null> {
    await prisma.folder.deleteMany({
      where: { id: { in: folderIds } },
    });
    return null;
  }
  async findAllNestedFolderIds(folderIds: number[]): Promise<number[]> {
    let allFolderIds: number[] = [];
    let currentLevelFolders = await prisma.folder.findMany({
      where: { parent_id: { in: folderIds } },
      select: { id: true }, // Sélectionne uniquement les identifiants
    });

    // Ajoute les identifiants des dossiers de niveau actuel à la liste de tous les identifiants
    allFolderIds = allFolderIds.concat(
      currentLevelFolders.map((folder) => folder.id)
    );

    while (currentLevelFolders.length > 0) {
      const nextLevelFolderIds = currentLevelFolders.map((folder) => folder.id);
      currentLevelFolders = await prisma.folder.findMany({
        where: { parent_id: { in: nextLevelFolderIds } },
        select: { id: true }, // Sélectionne uniquement les identifiants
      });

      // Ajoute les identifiants des dossiers de niveau actuel à la liste de tous les identifiants
      allFolderIds = allFolderIds.concat(
        currentLevelFolders.map((folder) => folder.id)
      );
    }

    return allFolderIds;
  }
}
