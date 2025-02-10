import { CrudDto } from 'src/db/dto/crud.dto';

export interface ICrudParams {
  id: string
  crudDto: CrudDto
}