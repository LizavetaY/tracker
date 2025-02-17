import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aim } from './schemas/aim.schema';
import { User } from '../auth/schemas/user.schema';
import { AddAimFileDto } from './dto/add-aim-file.dto';

@Injectable()
export class AimService {
  constructor(@InjectModel(Aim.name) private aimModel: Model<Aim>) {}

  async create(aim: Aim, user: User): Promise<Aim> {
    const aimToSave = Object.assign(aim, { user: user._id });

    return this.aimModel.create(aimToSave);
  }

  async findAll(user: User): Promise<Aim[]> {
    return this.aimModel.find({ user: user._id });
  }

  async findById(id: string): Promise<Aim> {
    const aim = await this.aimModel.findById(id);

    if (!aim) {
      throw new NotFoundException('Aim is not found.');
    }

    return aim;
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
  ): Promise<string> {
    const aim = await this.aimModel.findById(id);

    if (!aim) {
      throw new NotFoundException('Aim is not found.');
    }

    const fileToSave = {
      name: aimFile.name,
      type: file.mimetype,
      data: file.buffer?.toString('base64') || '',
    };

    await this.aimModel.findByIdAndUpdate(id, {
      files: [...aim.files, fileToSave],
    });

    return 'The file was successfully added!';
  }

  async getFile(
    id: string,
    fileName: string,
  ): Promise<{ buffer: Buffer; type: string }> {
    const aim = await this.aimModel.findById(id);

    if (!aim) {
      throw new NotFoundException('Aim is not found.');
    }

    const file = aim.files?.find((file) => file.name === fileName);

    if (!file) {
      throw new NotFoundException('File is not found.');
    }

    return {
      buffer: Buffer.from(file.data, 'base64'),
      type: file.type,
    };
  }
}
