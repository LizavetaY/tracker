import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true
})
export class AimFile {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  data: string;
}

export const AimFileSchema = SchemaFactory.createForClass(AimFile);
