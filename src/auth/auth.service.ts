import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ERROR_MESSAGES } from '../helpers/constants';
import { User } from './schemas/user.schema';
import { Creds } from './schemas/creds.schema';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Creds.name)
    private credsModel: Model<Creds>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
      });

      await this.credsModel.create({
        password: hashedPassword,
        user: user._id,
      });

      const token = this.jwtService.sign({ id: user._id });

      return { token };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException(ERROR_MESSAGES.emailAlreadyExists);
      }

      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidEmailOrPassword);
    }

    const userPassword = await this.credsModel.findOne({ user: user._id });

    if (!userPassword) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidEmailOrPassword);
    }

    const isPasswordMatch = await bcrypt.compare(password, userPassword.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.invalidEmailOrPassword);
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
