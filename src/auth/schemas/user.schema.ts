import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ unique: [ true, 'Email already exists' ] })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
