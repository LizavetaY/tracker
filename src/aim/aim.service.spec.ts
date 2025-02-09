import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';
import { User } from '../auth/schemas/user.schema';
import { Role } from '../auth/enums/role.enum';

const id = '678d539dfd0a09ed16a76290';
const title = 'New Aim';
const description = 'Aim Description';
const todos = [
  {
    title: 'some text',
    isCompleted: true,
  },
];

const aimMock = {
  _id: id,
  title,
  description,
  todos,
  user: id,
};
const userMock = {
  _id: id,
  name: 'User Name',
  email: 'test@test.com',
  roles: [Role.User],
};

describe('AimService', () => {
  let aimService: AimService;
  let model: jest.Mocked<Model<Aim>>;

  const aimServiceMock = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AimService,
        {
          provide: getModelToken(Aim.name),
          useValue: aimServiceMock,
        },
      ],
    }).compile();

    jest.spyOn(mongoose, 'isValidObjectId').mockImplementation((passedId) => passedId === id);

    aimService = module.get(AimService);
    model = module.get(getModelToken(Aim.name));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(aimService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an aim', async () => {
      model.create.mockResolvedValueOnce(aimMock as any);

      const createAimDto = { title, description };

      const result = await aimService.create(
        createAimDto as CreateAimDto,
        userMock as User,
      );

      expect(result).toEqual(aimMock);
      expect(model.create).toHaveBeenCalledWith(createAimDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of aims', async () => {
      model.find.mockReturnValueOnce([aimMock] as any);

      const result = await aimService.findAll(userMock as User);

      expect(result).toEqual([aimMock]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return an aim by ID', async () => {
      model.findById.mockResolvedValueOnce(aimMock as any);

      const result = await aimService.findById(aimMock._id);

      expect(result).toEqual(aimMock);
      expect(model.findById).toHaveBeenCalledWith(aimMock._id);
    });

    it('should throw NotFoundException if aim is not found', async () => {
      model.findById.mockResolvedValueOnce(null);

      await expect(aimService.findById(aimMock._id)).rejects.toThrow(NotFoundException);
      expect(model.findById).toHaveBeenCalledWith(aimMock._id);
    });
  });

  describe('delete', () => {
    it('should delete and return an aim ID if aim exists', async () => {
      model.findByIdAndDelete.mockResolvedValueOnce(aimMock as any);

      const result = await aimService.delete(aimMock._id);

      expect(result).toEqual(aimMock._id);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(aimMock._id);
    });

    it('should return a null if aim does not exist', async () => {
      model.findByIdAndDelete.mockResolvedValueOnce(null);

      const result = await aimService.delete(aimMock._id);

      expect(result).toEqual(null);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(aimMock._id);
    });
  });
});