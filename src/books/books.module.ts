import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './books.schema';
import { BooksDAL } from './books.DAL';
import { TopicsModule } from '../topics/topics.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'books', schema: BookSchema }]),
    TopicsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, BooksDAL],
})
export class BooksModule {}
