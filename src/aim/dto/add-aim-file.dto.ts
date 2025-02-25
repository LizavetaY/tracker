import { IsString, IsNotEmpty } from 'class-validator';

export class AddAimFileDto {
  @IsString()
  @IsNotEmpty({ message: 'File name is required' })
  name: string;
}