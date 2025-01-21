import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidId } from '../helpers/decorators/valid-id.decorator';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../auth/schemas/user.schema';

@Controller('aims')
export class AimController {
  constructor(private aimService: AimService) {
  }

  @Post()
  async createAim(@Body() aim: CreateAimDto, @CurrentUser() user: User): Promise<Aim> {
    return this.aimService.create(aim, user);
  }

  @Get()
  getAllAims(@CurrentUser() user: User): Promise<Aim[]> {
    return this.aimService.findAll(user);
  }

  @Get(':id')
  async getAim(@ValidId() id: string): Promise<Aim> {
    return this.aimService.findById(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteAim(@ValidId() id: string): Promise<string | null> {
    return this.aimService.delete(id);
  }
}
