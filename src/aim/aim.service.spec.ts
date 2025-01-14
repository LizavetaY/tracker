import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AimService } from './aim.service';
import { Aim } from './schemas/aim.schema';
import { CreateAimDto } from './dto/create-aim.dto';

const title = 'New Aim';
const description = 'Aim Description';

const aimMock: CreateAimDto = { title, description };

describe('AimService', () => {
  let aimService: AimService;
  let model: jest.Mocked<Model<Aim>>;

  const aimServiceMock = {
    create: jest.fn(),
    find: jest.fn(),
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

    aimService = module.get(AimService);
    model = module.get(getModelToken(Aim.name));
  });

  it('should be defined', () => {
    expect(aimService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an aim', async () => {
      model.create.mockResolvedValueOnce(aimMock as any);

      const createAimDto: CreateAimDto = { title, description };

      const result = await aimService.create(createAimDto);

      expect(result).toEqual(aimMock);
      expect(model.create).toHaveBeenCalledWith(createAimDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of aims', async () => {
      model.find.mockReturnValueOnce([aimMock] as any);

      const result = await aimService.findAll();

      expect(result).toEqual([aimMock]);
      expect(model.find).toHaveBeenCalled();
    });
  });
});