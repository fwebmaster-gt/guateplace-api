import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as fs from "fs";
import { extname, join } from "path";
import { promisify } from "util";
import { v4 as Uuid } from "uuid";

const writeFile = promisify(fs.writeFile);

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION, // Reemplaza con tu región
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    if (process.env.NODE_ENV === "development") {
      // Guardar el archivo localmente en entorno de desarrollo

      const fileName = `${Date.now()}${extname(file.originalname)}.png`;

      const localPath = join(__dirname, "..", "..", "uploads", fileName);

      try {
        await writeFile(localPath, file.buffer);

        return `http://localhost:${process.env.PORT}/uploads/${fileName}`;
      } catch (error) {
        console.log(error);

        throw new HttpException(
          "Error saving file locally",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } else {
      // Subir el archivo a S3 en otros entornos
      const uploadParams = {
        Bucket: "furever-loudfishlabs",
        Key: `${Date.now()}-${Uuid()}.png`, // Nombre del archivo en S3
        Body: file.buffer,
      };

      try {
        const command = new PutObjectCommand(uploadParams);

        await this.s3Client.send(command);

        return await getSignedUrl(this.s3Client, command, {
          expiresIn: 604800, // seven days
        });
      } catch (error) {
        console.log(error);
        throw new HttpException(
          "Error uploading file",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
