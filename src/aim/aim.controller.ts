import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('aims')
export class AimController {
  constructor(private aimService: AimService) {
  }

  @Post()
  async createAim(@Body() aim: CreateAimDto, @Req() req: any): Promise<Aim> {
    return this.aimService.create(aim, req.user);
  }

  @Get()
  getAllAims(@Req() req: any): Promise<Aim[]> {
    return this.aimService.findAll(req.user);
  }

  @Get(':id')
  async getAim(@Param('id') id: string): Promise<Aim> {
    return this.aimService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteAim(@Param('id') id: string): Promise<string | null> {
    return this.aimService.delete(id);
  }
}
