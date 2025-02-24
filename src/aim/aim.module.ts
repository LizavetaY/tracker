import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AimController } from './aim.controller';
import { AimService } from './aim.service';
import { Aim, AimSchema } from './schemas/aim.schema';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from 'src/files/upload.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Aim.name, schema: AimSchema }]),
    UploadModule,
  ],
  controllers: [AimController],
  providers: [AimService]
})
export class AimModule {}
