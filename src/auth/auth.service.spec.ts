import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

const token = 'jwtToken';

const userMock = {
  _id: '61c0ccf11d7bf83d153d7c06',
  name: 'User Name',
  email: 'test@test.com',
  password: 'hashedPassword',
};

describe('AuthService', () => {
  let authService: AuthService;
  let model: jest.Mocked<Model<User>>;
  let jwtService: JwtService;

  const authServiceMock = {
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
      ],
    }).compile();

    authService = module.get(AuthService);
    model = module.get(getModelToken(User.name));
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
      model.create.mockResolvedValueOnce(userMock as any);

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(model.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        password: 'hashedPassword',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userMock._id });
      expect(result).toEqual({ token });
    });

    it('should throw duplicate email entered', async () => {
      model.create.mockRejectedValueOnce({ code: 11000 } as any);

      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logIn', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: '12345678',
    };

    it('should login user and return the token', async () => {
      model.findOne.mockResolvedValue(userMock as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(model.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, userMock.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: userMock._id });
      expect(result).toEqual({ token });
    });

    it('should throw invalid email error', async () => {
      model.findOne.mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw invalid password error', async () => {
      model.findOne.mockResolvedValue(userMock as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, userMock.password);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});