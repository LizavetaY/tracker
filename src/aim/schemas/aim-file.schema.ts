import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true
})
export class AimFile {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  type: string;
}

export const AimFileSchema = SchemaFactory.createForClass(AimFile);
