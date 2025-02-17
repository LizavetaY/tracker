import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IntentsBitField } from 'discord.js';
import { NecordModule } from 'necord';
import { DiscordBotCommands } from './discord-bot.commands';
import { DiscordBotService } from './discord-bot.service';
import { DiscordBotComponents } from './disrord-bot.components';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Aim, AimSchema } from 'src/aim/schemas/aim.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Aim.name, schema: AimSchema },
    ]),
    AuthModule,
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN || '',
      development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID || ''],
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
      ],
    }),
  ],
  providers: [DiscordBotComponents, DiscordBotCommands, DiscordBotService],
})
export class DiscordBotModule {}