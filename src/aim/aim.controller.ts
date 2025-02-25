import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Role } from '../auth/enums/role.enum';
import { HasRoles } from '../auth/decorators/has-roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidObjectId } from '../helpers/decorators/valid-object-id.decorator';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';
import { User } from '../auth/schemas/user.schema';
import { AddAimFileDto } from './dto/add-aim-file.dto';

@Controller('aims')
export class AimController {
  constructor(private aimService: AimService) {}

  @Post()
  async createAim(
    @Body() aim: CreateAimDto,
    @CurrentUser() user: User,
  ): Promise<Aim> {
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

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/:id')
  async uploadFile(
    @ValidObjectId() id: string,
    @Body() body: AddAimFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(image\/(jpeg|png)|application\/pdf)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<string | null> {
    return this.aimService.uploadFile(id, body, file);
  }

  @Get('file/:id')
  async getFile(@ValidObjectId() fileId: string, @Res() res: Response) {
    return this.aimService.getFile(fileId, res);
  }
}
