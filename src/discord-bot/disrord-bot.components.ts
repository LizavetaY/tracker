import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { Model } from 'mongoose';
import {
  Context,
  Button,
  ButtonContext,
  Modal,
  Ctx,
  ModalContext,
  ComponentParam,
} from 'necord';
import { Commands } from './enums/commands.enum';
import { Aim } from 'src/aim/schemas/aim.schema';
import { User } from 'src/auth/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class DiscordBotComponents {
  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    @InjectModel(Aim.name) 
    private aimModel: Model<Aim>,
    private authService: AuthService
  ) {}

  @Button('BUTTON/:command')
  public onAddAimButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('command') command: string,
  ) {
    if (command === Commands.GetAimInfo) {
      return interaction.reply({ content: 'Some important information!' });
    }

    return interaction.showModal(
      new ModalBuilder()
        .setTitle('Provide the information below')
        .setCustomId('MODAL-CREATE-AIM')
        .setComponents([
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('Aim Title')
              .setStyle(TextInputStyle.Short),
          ]),
          new ActionRowBuilder<TextInputBuilder>().addComponents([
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('Aim Description')
              .setStyle(TextInputStyle.Paragraph),
          ])
        ])
    );
  }

  @Modal('MODAL-CREATE-ACCOUNT')
  public async onModalCreateAccount(@Ctx() [interaction]: ModalContext) {
    try {
      const email = interaction.fields.getTextInputValue('email') || '';

      const userFromDB = await this.userModel.findOne({ email });

      if (userFromDB) {
        return interaction.reply({
          content: 'This email is already taken!',
        });
      }

      const userToCreate: SignUpDto = {
        name: interaction.fields.getTextInputValue('name') || '',
        surname: interaction.fields.getTextInputValue('surname') || '',
        email,
        password: interaction.fields.getTextInputValue('password') || '',
        discord_nickname: interaction.user?.username || '',
      };

      await this.authService.signUp(userToCreate);

      return interaction.reply({
        content: 'Your account was successfully created!',
      });
    } catch (error) {
      return interaction.reply({
        content: `Ooops, something went wrong! The error is: ${error}`,
      });
    }
  }

  @Modal('MODAL-CREATE-AIM')
  public async onModalCreateAim(@Ctx() [interaction]: ModalContext) {
    try {
      const userFromDB = await this.userModel.findOne({
        discord_nickname: interaction.user?.username,
      });
  
      if (!userFromDB) {
        return interaction.reply({
          content: "You don't have an account! Use /create-account command",
        });
      }
  
      const aimToSave = {
        title: interaction.fields.getTextInputValue('title') || '',
        description: interaction.fields.getTextInputValue('description') || '',
        user: userFromDB._id,
      };
  
      await this.aimModel.create(aimToSave);
  
      return interaction.reply({
        content: 'Your aim was successfully created!',
      });
    } catch (error) {
      return interaction.reply({
        content: `Ooops, something went wrong! The error is: ${error}`,
      });
    }
  }
}