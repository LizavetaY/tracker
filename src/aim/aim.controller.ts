import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { HasRoles } from '../auth/decorators/has-roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidObjectId } from '../helpers/decorators/valid-object-id.decorator';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';
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
  async getAim(@ValidObjectId() id: string): Promise<Aim> {
    return this.aimService.findById(id);
  }

  @Delete(':id')
  @HasRoles(Role.Admin)
  async deleteAim(@ValidObjectId() id: string): Promise<string | null> {
    return this.aimService.delete(id);
  }
}
