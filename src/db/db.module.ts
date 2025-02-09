import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DBController } from './db.controller';
import { DBService } from './db.service';

@Module({
  imports: [AuthModule],
  controllers: [DBController],
  providers: [DBService]
})
export class DBModule {}
