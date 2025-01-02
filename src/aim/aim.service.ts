import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aim } from './schemas/aim.schema';

@Injectable()
export class AimService {
  constructor(@InjectModel(Aim.name) private aimModel: Model<Aim>) {}

  async create(aim: Aim): Promise<Aim> {
    return this.aimModel.create(aim);
  }

  async findAll(): Promise<Aim[]> {
    return this.aimModel.find();
  }
}
