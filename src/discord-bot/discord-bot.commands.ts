import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { Commands } from './enums/commands.enum';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class DiscordBotCommands {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @SlashCommand({ name: 'create-account', description: 'Create an account' })
  public async onCreateAccount(@Context() [interaction]: SlashCommandContext) {
    const discordNickname = interaction.user?.username || '';

    const userFromDBByDiscordNickname = await this.userModel.findOne({
      discord_nickname: discordNickname,
    });

    if (userFromDBByDiscordNickname) {
      return interaction.reply({
        content: 'You already have an account!',
      });
    }

    return interaction.showModal(
      new ModalBuilder()
        .setTitle('Provide the information below')
        .setCustomId('MODAL-CREATE-ACCOUNT')
        .setComponents([
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('name')
              .setLabel('Name')
              .setStyle(TextInputStyle.Short),
          ]),
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('surname')
              .setLabel('Surname')
              .setStyle(TextInputStyle.Short),
          ]),
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('email')
              .setLabel('Email')
              .setStyle(TextInputStyle.Short),
          ]),
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('password')
              .setLabel('Password')
              .setStyle(TextInputStyle.Short),
          ]),
        ])
    );
  }

  @SlashCommand({ name: 'create-aim', description: 'Create a new aim' })
  public async onCreateAim(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({
      content: `Hello :)\nTo create an aim or a habit, please click the appropriate button below`,
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`BUTTON/${Commands.GetAimInfo}`)
            .setLabel('Learn more how to create an aim or habit')
            .setStyle(ButtonStyle.Primary),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`BUTTON/${Commands.CreateAim}`)
            .setLabel('Create a new aim or habit')
            .setStyle(ButtonStyle.Success),
        ),
      ]
    });
  }
}