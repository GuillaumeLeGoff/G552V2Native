import { PrismaClient, Folder } from "@prisma/client";
import { Service } from "typedi";
import { CreateFolderDto } from "./folder.validation";

const prisma = new PrismaClient();

@Service()
export class FolderService {
  async getAllFolders(user_id: number): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: { user_id, parent_id: null },
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
    const folder = await prisma.folder.create({
      data: {
        name: folderData.name,
        user_id: user_id,
        parent_id: folderData.parent_id ? folderData.parent_id : null,
      },
    });

    return folder;
  }
  async updateFolder(
    id: number,
    folderData: CreateFolderDto
  ): Promise<Folder | null> {
    console.log(folderData.parent_id ? folderData.parent_id : undefined);

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        name: folderData.name,
        parent_id: folderData.parent_id ? folderData.parent_id : null,
      },
    });
    return folder;
  }

  async deleteFolder(ids: number[]): Promise<Folder | null> {
    const folder = await prisma.folder.deleteMany({
      where: { id: { in: ids } },
    });
    return null;
  }
}
