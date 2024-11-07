import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto, UpdateTopicDto } from './topics.dto';
import { TopicsDAL } from './topics.DAL';
import { Topic } from './topics.schema';

@Injectable()
export class TopicsService {
  constructor(private readonly topicsDAL: TopicsDAL) {}

  // Create a new topic
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    try {
      return await this.topicsDAL.create(createTopicDto);
    } catch (error) {
      throw error;
    }
  }

  // Find all topics with pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    filterByName: string,
  ): Promise<{ topics: Topic[]; totalEntries: number }> {
    try {
      const skip = (page - 1) * limit;
      return await this.topicsDAL.findAll(limit, skip, filterByName);
    } catch (error) {
      throw error;
    }
  }

  // Find a topic by ID
  async findOne(id: string): Promise<Topic> {
    try {
      const topic = await this.topicsDAL.findOne(id);
      if (!topic) {
        throw new NotFoundException(`Topic with ID ${id} not found`);
      }
      return topic;
    } catch (error) {
      throw error;
    }
  }

  // Update a topic by ID
  async update(
    id: string,
    updateTopicDto: UpdateTopicDto,
  ): Promise<Topic | null> {
    try {
      const updatedTopic = await this.topicsDAL.update(id, updateTopicDto);
      return updatedTopic;
    } catch (error) {
      throw error;
    }
  }

  // Remove a topic by ID
  async remove(id: string): Promise<String> {
    try {
      const deletedTopic = await this.topicsDAL.remove(id);
      if (!deletedTopic.message) {
        throw new NotFoundException(`Topic with ID ${id} not found`);
      }
      return deletedTopic.message;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<Topic[]> {
    try {
      return await this.topicsDAL.findByName(name);
    } catch (error) {
      throw error;
    }
  }
}
