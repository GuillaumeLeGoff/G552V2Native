import { Media, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import { UpdateMediaDto } from "./media.validation";
import { log } from "console";
import { UserType } from "../../types/user.type";

const prisma = new PrismaClient();

@Service()
export class MediaService {
  async createMedia(req: any, res: any, next: any) {
    const file = req.file;
    const folderId = parseInt(req.body.folderId, 10);

    const media = {
      original_file_name: file.originalname,
      file_name: file.filename,
      path: file.path,
      format: file.mimetype.split("/")[1],
      type: file.mimetype.split("/")[0],
      size: file.size,
      uploaded_at: new Date(),
      user_id: parseInt(req.user.id, 10),
      folder_id: folderId,
      thumbnail_path: file.thumbnail_path || null,
      thumbnail_name: file.thumbnail_name || null,
    };
    try {
      await prisma.media.create({
        data: media,
      });
      next();
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Cannot create media");
    }
  }

  async findAllMedias(user: UserType): Promise<Media[]> {
    return prisma.media.findMany({
      where: {
        user_id: user.id,
      },
    });
  }

  async findMedia(mediaIds: number[]): Promise<Media[]> {
    const media = await prisma.media.findMany({
      where: { id: { in: mediaIds } },
    });
    if (!media) {
      throw new HttpException(404, `Media with ID ${mediaIds} doesn't exist.`);
    }
    return media;
  }

  async findMediaByFolderId(
    folderId: number,
    user: UserType
  ): Promise<Media[]> {
    const media = await prisma.media.findMany({
      where: { folder_id: folderId, user_id: user.id },
    });
    return media;
  }

  async updateMedia(
    mediaId: number,
    data: UpdateMediaDto
  ): Promise<UpdateMediaDto> {
    console.log(data);
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });
    if (!media) {
      throw new HttpException(404, `Media with ID ${mediaId} doesn't exist.`);
    }
    return prisma.media.update({
      where: { id: mediaId },
      data,
    });
  }

  async deleteMedias(mediaIds: number[]): Promise<null> {
    await prisma.media.deleteMany({
      where: { id: { in: mediaIds } },
    });

    return null;
  }
 
}
