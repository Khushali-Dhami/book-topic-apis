import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { TopicsDAL } from './topics.DAL';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './topics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService, TopicsDAL],
  exports: [TopicsService],
})
export class TopicsModule {}
