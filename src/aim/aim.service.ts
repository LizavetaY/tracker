import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aim } from './schemas/aim.schema';
import { User } from '../auth/schemas/user.schema';

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
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

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
}
