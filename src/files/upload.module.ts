import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UploadService } from './upload.service';

@Module({
  imports: [AuthModule],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
