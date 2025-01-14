import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { Creds } from './schemas/creds.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const userId = '61c0ccf11d7bf83d153d7c06';
const password = 'hashedPassword';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

const token = 'jwtToken';

const userMock = {
  _id: userId,
  name: 'User Name',
  email: 'test@test.com',
};

const credsMock = {
  password,
  user: userId,
};

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: jest.Mocked<Model<User>>;
  let credsModel: jest.Mocked<Model<Creds>>;
  let jwtService: JwtService;

  const authServiceMock = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  const credsServiceMock = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: authServiceMock,
        },
        {
          provide: getModelToken(Creds.name),
          useValue: credsServiceMock,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    userModel = module.get(getModelToken(User.name));
    credsModel = module.get(getModelToken(Creds.name));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      name: 'User Name',
      email: 'test@test.com',
      password: '12345678'
    };

    it('should create a new user and return the token', async () => {
      userModel.create.mockResolvedValueOnce(userMock as any);
      credsModel.create.mockResolvedValueOnce(credsMock as any);

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(userModel.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
      });
      expect(credsModel.create).toHaveBeenCalledWith({
        password,
        user: userMock._id
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userMock._id });
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email entered', async () => {
      userModel.create.mockRejectedValueOnce({ code: 11000 } as any);

      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logIn', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: '12345678',
    };

    it('should login user and return the token', async () => {
      userModel.findOne.mockResolvedValue(userMock as any);
      credsModel.findOne.mockResolvedValue(credsMock as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(credsModel.findOne).toHaveBeenCalledWith({ user: userMock._id });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, credsMock.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userMock._id });
      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
      userModel.findOne.mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw invalid password error', async () => {
      userModel.findOne.mockResolvedValue(userMock as any);
      credsModel.findOne.mockResolvedValue(credsMock as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, credsMock.password);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});