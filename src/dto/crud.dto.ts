import { IsNotEmpty, IsEnum, ValidateIf } from 'class-validator';
import { CRUD } from 'src/helpers/enums/crud.enum';

export class CrudDto {
  @IsNotEmpty()
  @IsEnum(CRUD)
  crudOperation: CRUD;

  @ValidateIf(o => o.crudOperation === CRUD.Put || o.crudOperation === CRUD.Delete)
  @IsNotEmpty()
  idToUpdateDelete: string;

  @ValidateIf(o => o.crudOperation === CRUD.Post || o.crudOperation === CRUD.Put)
  @IsNotEmpty()
  objectToCreateUpdate: any;
}