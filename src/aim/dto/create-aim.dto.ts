import { IsString, IsNotEmpty, IsEmpty } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class CreateAimDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  description: string;

  @IsEmpty()
  user: User;
}