import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [ true, 'Email already exists' ] })
  email: string;

  @Prop({
    type: [{ type: String, enum: Role }],
    default: [Role.User],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
