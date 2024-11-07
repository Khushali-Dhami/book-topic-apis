import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from './topics.schema';
import { CreateTopicDto, UpdateTopicDto } from './topics.dto';

@Injectable()
export class TopicsDAL {
  constructor(
    @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
  ) {}

  // Create a new topic with uniqueness check for name
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    try {
      const existingTopic = await this.topicModel
        .findOne({ name: createTopicDto.name })
        .exec();
      if (existingTopic) {
        throw new Error(
          `Topic with name ${createTopicDto.name} already exists.`,
        );
      }

      const createdTopic = new this.topicModel(createTopicDto);
      return createdTopic.save();
    } catch (error) {
      throw error;
    }
  }

  // Retrieve all topics with pagination
  async findAll(
    limit: number,
    skip: number,
    filterByName: string,
  ): Promise<{ topics: Topic[]; totalEntries: number }> {
    try {
      const filter = filterByName
        ? { name: { $regex: filterByName, $options: 'i' } }
        : {};
      const topics = await this.topicModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .exec();
      // Get the total count of records
      const totalEntries = await this.topicModel.countDocuments(filter).exec();

      return {
        topics,
        totalEntries,
      };
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a single topic by ID
  async findOne(id: string): Promise<Topic | null> {
    try {
      return this.topicModel.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  // Update a topic by ID with uniqueness check for name
  async update(
    id: string,
    updateTopicDto: UpdateTopicDto,
  ): Promise<Topic | null> {
    try {
      const result = await this.findOne(id);
      if (!result) {
        throw new NotFoundException(`Topic with ID ${id} not found`);
      }
      if (updateTopicDto.name) {
        const existingTopic = await this.topicModel
          .findOne({
            name: updateTopicDto.name,
            _id: { $ne: id },
          })
          .exec();
        if (existingTopic) {
          throw new ConflictException(
            `Topic with name ${updateTopicDto.name} already exists.`,
          );
        }
      }

      return this.topicModel
        .findByIdAndUpdate(id, updateTopicDto, { new: true })
        .exec();
    } catch (error) {
      throw error;
    }
  }

  // Delete the topic by id
  async remove(id: string) {
    try {
      const result = await this.topicModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new Error('Topic not found');
      }
      return { message: 'Topic deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<Topic[]> {
    try {
      return await this.topicModel
        .find({
          name: { $regex: name, $options: 'i' },
        })
        .exec();
    } catch (error) {
      throw error;
    }
  }
}
