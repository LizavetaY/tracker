import { Body, Controller, Post } from '@nestjs/common';
import { DBService } from './db.service';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CrudDto } from './dto/crud.dto';
import { ValidObjectId } from 'src/helpers/decorators/valid-object-id.decorator';
import { Public } from 'src/auth/decorators/publicity.decorator';
import { transformObject } from 'src/helpers/helpers';

@Controller('db')
export class DBController {
  constructor(private dbService: DBService) {}

  @Public()
  @Post('/crud')
  // @HasRoles(Role.Admin)
  async crud(
    @Body() crudDto: CrudDto,
    @ValidObjectId() id?: string
  ): Promise<any> {
    return this.dbService.crud({ 
      id: id || '',
      crudDto: {
        ...crudDto,
        body: transformObject(crudDto.body)
      },
    });
  }
}
