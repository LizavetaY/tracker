import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Todo } from './todo.schema';
import { AimFile } from './aim-file.schema';

@Schema({
  timestamps: true
})
export class Aim {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop()
  todos: Todo[];

  @Prop()
  files: AimFile[];
}

export const AimSchema = SchemaFactory.createForClass(Aim);
