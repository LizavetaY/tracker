import { Body, Controller, Get, Post } from '@nestjs/common';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';

@Controller('aims')
export class AimController {
  constructor(private aimService: AimService) {}

  @Post()
  async createAim(@Body() aim: CreateAimDto): Promise<Aim> {
    return this.aimService.create(aim);
  }

  @Get()
  getAllAims(): Promise<Aim[]> {
    return this.aimService.findAll();
  }
}
