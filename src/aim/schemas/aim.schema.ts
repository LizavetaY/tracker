import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true
})
export class Aim {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export const AimSchema = SchemaFactory.createForClass(Aim);
