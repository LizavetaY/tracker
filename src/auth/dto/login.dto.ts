import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please, enter correct email' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}