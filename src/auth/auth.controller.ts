import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { Public } from './decorators/publicity.decorator';
import { Roles } from './decorators/role.decorator';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AddAdminRoleDto } from './dto/add-admin-role.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Get('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('/add-role')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async addAdminRole(@Body() addAdminRoleDto: AddAdminRoleDto): Promise<User | null> {
    return this.authService.addAdminRole(addAdminRoleDto);
  }
}
