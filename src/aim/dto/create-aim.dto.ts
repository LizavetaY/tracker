import { IsString, IsNotEmpty, IsEmpty, IsOptional } from 'class-validator';
import { User } from '../../auth/schemas/user.schema';
import { Todo } from '../schemas/todo.schema';

export class CreateAimDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  description: string;

  @IsEmpty()
  user: User;

  @IsOptional()
  todos: Todo[];
}