import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Topic } from 'src/topics/topics.schema';

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  author!: string;

  @Prop({ type: Date, required: false })
  publishedDate?: Date;

  @Prop({ type: String, required: true, unique: true })
  isbn!: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Topic' }],
    required: false,
  })
  topics?: Topic[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
