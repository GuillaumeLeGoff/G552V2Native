import { Media, PrismaClient } from "@prisma/client";
import { exec } from "child_process"; // Ajout de l'import pour exécuter des commandes shell
import { NextFunction } from "express";
import { unlinkSync, existsSync } from "fs";
import multer from "multer";
import path from "path";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { HttpException } from "../../exceptions/HttpException";

const prisma = new PrismaClient();
@Service()
export class UploadService {
  private getExtension(mimetype: string) {
    const parts = mimetype.split("/");
    return parts[parts.length - 1];
  }

  private getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${filePath}`;
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(parseFloat(stdout));
        }
      });
    });
  }

  private generateThumbnail(
    filePath: string,
    thumbnailPath: string,
    captureTime: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = `ffmpeg -i ${filePath} -ss ${captureTime} -vframes 1 ${thumbnailPath}`;
      exec(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public handleUpload = async (req: any, res: any, next: NextFunction) => {
    console.log("Request Body:", req.body);
    try {
      const uploadDir = path.resolve(
        __dirname,
        `../../../${process.env.UPLOAD_DIR}/${req.user.username}`
      );
      const upload = multer({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, uploadDir);
          },
          filename: (req, file, cb) => {
            const ext = this.getExtension(file.mimetype);
            const filename = `${uuidv4()}.${ext}`;
            cb(null, filename);
          },
        }),
      });

      upload.single("file")(req, res, async (err) => {
        console.log("req.file", req.file);
        if (err) {
          console.log(err);
          throw new HttpException(500, "Cannot upload file");
        }
        if (req.file.mimetype.startsWith("video/")) {
          const thumbnailName = `${uuidv4()}.png`;
          const thumbnailPath = path.join(uploadDir, thumbnailName);
          try {
            const duration = await this.getVideoDuration(req.file.path);
            const captureTime = duration / 2;
            await this.generateThumbnail(
              req.file.path,
              thumbnailPath,
              captureTime
            );
            req.file.thumbnail_path = thumbnailPath;
            req.file.thumbnail_name = thumbnailName;
            req.file.duration = duration;
          } catch (error) {
            console.log(error);
            throw new HttpException(500, "Cannot generate thumbnail");
          }
        }

        next();
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteMedias = async (medias: Media[]): Promise<void> => {
    try {
      for (const media of medias) {
        if (existsSync(media.path)) {
          unlinkSync(media.path);
        } else {
          console.log(`File not found: ${media.path}`);
        }

        if (media.thumbnail_path) {
          if (existsSync(media.thumbnail_path)) {
            unlinkSync(media.thumbnail_path);
          } else {
            console.log(`Thumbnail not found: ${media.thumbnail_path}`);
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Cannot delete media");
    }
  };

  public deleteAllMedia = async (): Promise<void> => {
    try {
      // Récupérer tous les médias
      const medias: Media[] = await prisma.media.findMany();

      for (const media of medias) {
        // Supprimer le fichier principal
        unlinkSync(media.path);

        // Supprimer la vignette si elle existe
        if (media.thumbnail_path) {
          unlinkSync(media.thumbnail_path);
        }
      }

      // Supprimer tous les enregistrements média de la base de données
      await prisma.media.deleteMany();
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Impossible de supprimer tous les médias");
    }
  };

  uploadMediaService = async (file: Express.Multer.File, folderId: string) => {
    // Utilisez folderId pour stocker le fichier dans le bon dossier
    // Logique d'upload ici, par exemple, en utilisant un service de stockage cloud

    // Exemple de logique fictive
    const storagePath = `uploads/${folderId}/${file.originalname}`;
    // Code pour sauvegarder le fichier à storagePath

    return { message: "File uploaded successfully", path: storagePath };
  };
}
