import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { TopicsModule } from './topics/topics.module';
import { BooksModule } from './books/books.module';
config();

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ja0ri.mongodb.net/`,
    ),
    TopicsModule,
    BooksModule,
  ],
})
export class AppModule {}
