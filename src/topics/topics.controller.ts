import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { Topic } from './topics.schema';
import { CreateTopicDto, UpdateTopicDto } from './topics.dto';
import { GetAllTopics, GetTopic } from './topics.interface';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicService: TopicsService) {}

  /**
   * Get all topics with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all topics with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'filterByName',
    required: false,
    type: String,
    description: 'Filter Topics by Name',
  })
  @ApiResponse({
    status: 200,
    description: 'Topics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterByName') filterByName: string,
  ): Promise<GetAllTopics<Topic[]>> {
    try {
      // Call the service method to get the paginated topics
      const { topics, totalEntries } = await this.topicService.findAll(
        page,
        limit,
        filterByName,
      );
      const totalPages = Math.ceil(totalEntries / limit ? limit : 10);
      return {
        status: 'success',
        data: {
          items: topics,
          totalEntries,
          totalPages,
          currentPage: page ? page : 1,
          itemsPerPage: limit ? limit : 10,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'An unknown error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Create a new topic
   */
  @Post()
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({
    status: 201,
    description: 'Topic created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Body() createTopicDto: CreateTopicDto,
  ): Promise<GetTopic<Topic>> {
    try {
      const result = await this.topicService.create(createTopicDto);
      return { status: 'success', data: result };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'An unknown error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Get a specific topic by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific topic by ID' })
  @ApiResponse({
    status: 200,
    description: 'Topic retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string): Promise<GetTopic<Topic>> {
    try {
      const result = await this.topicService.findOne(id);
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'An unknown error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Update a specific topic by ID
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a specific topic by ID' })
  @ApiResponse({
    status: 200,
    description: 'Topic updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<GetTopic<Topic>> {
    try {
      const result = await this.topicService.update(id, updateTopicDto);
      if (result) {
        return {
          status: 'success',
          data: result,
        };
      } else {
        return {
          status: 'error',
          message: 'Topic not found',
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'An unknown error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /**
   * Delete a specific topic by ID
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific topic by ID' })
  @ApiResponse({
    status: 200,
    description: 'Topic deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string): Promise<GetTopic<Topic>> {
    try {
      await this.topicService.remove(id);
      return { status: 'success', message: 'Topic deleted successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(
          {
            status: 'error',
            message: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          {
            status: 'error',
            message: 'An unknown error occurred',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
