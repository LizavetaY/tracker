import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CRUD } from 'src/db/enums/crud.enum';
import { Collections } from '../enums/collections.enum';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { CreateAimDto } from 'src/aim/dto/create-aim.dto';

export class CrudDto {
  @IsNotEmpty()
  @IsEnum(Collections)
  collection: Collections;

  @IsNotEmpty()
  @IsEnum(CRUD)
  operation: CRUD;

  @ValidateIf(o => o.operation === CRUD.Get)
  @IsOptional()
  filter: any;

  @ValidateIf(o => o.operation === CRUD.Post || o.operation === CRUD.Put)
  @IsNotEmpty()
  @Type(payload => payload?.object?.collection === Collections.Users ? SignUpDto : CreateAimDto)
  @ValidateNested()
  body: any;
}