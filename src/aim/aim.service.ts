import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { ERROR_MESSAGES } from 'src/helpers/constants';
import { Aim } from './schemas/aim.schema';
import { User } from '../auth/schemas/user.schema';
import { AddAimFileDto } from './dto/add-aim-file.dto';
import { UploadService } from 'src/files/upload.service';

@Injectable()
export class AimService {
  constructor(
    @InjectModel(Aim.name) 
    private aimModel: Model<Aim>,
    private uploadService: UploadService,
  ) {}

  async getAimById(aimId: string): Promise<Aim> {
    const aim = await this.aimModel.findById(aimId);

    if (!aim) {
      throw new NotFoundException(ERROR_MESSAGES.aimNotFound);
    }

    return aim;
  }

  async create(aim: Aim, user: User): Promise<Aim> {
    const aimToSave = Object.assign(aim, { user: user._id });

    return this.aimModel.create(aimToSave);
  }

  async findAll(user: User): Promise<Aim[]> {
    return this.aimModel.find({ user: user._id });
  }

  async findById(id: string): Promise<Aim> {
    return this.getAimById(id);
  }

  async delete(id: string): Promise<string | null> {
    const deletedAim = await this.aimModel.findByIdAndDelete(id);

    if (!deletedAim) {
      return null;
    }

    return id;
  }

  async uploadFile(
    id: string,
    aimFile: AddAimFileDto,
    file: Express.Multer.File,
  ): Promise<string | null> {
    return this.uploadService.uploadFile(id, aimFile.name, file);
  }

  async getFile(fileId: string, res: Response) {
    return this.uploadService.getFile(fileId, res);
  }
}
