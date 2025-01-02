import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAimDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  description: string;
}