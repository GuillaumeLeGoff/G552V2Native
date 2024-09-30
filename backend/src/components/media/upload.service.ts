import { NextFunction } from "express";
import { unlinkSync } from "fs";
import multer from "multer";
import { Inject, Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { HttpException } from "../../exceptions/HttpException";
import { Media } from "@prisma/client";
import path from "path";
import { exec } from "child_process"; // Ajout de l'import pour exécuter des commandes shell

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

  public deleteMedia = async (media: Media): Promise<void> => {
    try {
      console.log(media);

      unlinkSync(media.path);
      if (media.thumbnail_path) {
        unlinkSync(media.thumbnail_path); // Supprime également la vignette
      }
    } catch (error) {
      console.log(error);

      throw new HttpException(500, "Cannot delete media");
    }
  };
}
