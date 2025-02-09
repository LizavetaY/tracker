import { Body, Controller, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { HasRoles } from './auth/decorators/has-roles.decorator';
import { Role } from './auth/enums/role.enum';
import { CrudDto } from './dto/crud.dto';

@Controller('app')
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/crud')
  @HasRoles(Role.Admin)
  async crud(
    @Query('collection') collectionName: string,
    @Body() crudDto: CrudDto
  ): Promise<any> {
    return this.appService.crud(collectionName, crudDto);
  }
}
