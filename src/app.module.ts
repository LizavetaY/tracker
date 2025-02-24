import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AimModule } from './aim/aim.module';
import { AuthModule } from './auth/auth.module';
import { DBModule } from './db/db.module';
import { DiscordBotModule } from './discord-bot/discord-bot.module';
import { UploadModule } from './files/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI || ''),
    AimModule,
    AuthModule,
    DBModule,
    DiscordBotModule,
    UploadModule,
  ]
})

export class AppModule {}
