import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Topic extends Document {
  @Prop({ type: String, required: true, unique: true })
  name!: string;

  @Prop({ type: String, required: false })
  description!: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
