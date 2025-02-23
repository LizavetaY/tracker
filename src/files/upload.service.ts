import { Injectable } from '@nestjs/common';
import { GridFSBucket } from 'mongodb';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { Response } from 'express';
import { ERROR_MESSAGES } from 'src/helpers/constants';

@Injectable()
export class UploadService {
  private bucket: GridFSBucket;

  constructor(@InjectConnection() private readonly connection: Connection) {
    // @ts-ignore
    this.bucket = new GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(file.originalname);

      uploadStream.end(file.buffer);

      uploadStream.on('finish', () => {
        const savedId = uploadStream.id ? String(uploadStream.id) : null;

        resolve(savedId);
      });

      uploadStream.on('error', (error) => reject(error));
    });
  }

  async getFile(fileId: string, res: Response) {
    const downloadStream = this.bucket.openDownloadStream(
      new Types.ObjectId(fileId),
    );

    downloadStream.pipe(res);

    downloadStream.on('error', () => {
      res.send(ERROR_MESSAGES.fileNotFound);
    });
  }
}