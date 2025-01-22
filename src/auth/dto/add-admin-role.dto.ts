import { IsNotEmpty, IsEmail } from 'class-validator';

export class AddAdminRoleDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please, enter correct email' })
  email: string;
}