import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Book } from './books.schema';
import { CreateBookDto, UpdateBookDto } from './books.dto';
import { GetAllBooks, GetBook } from './books.interface';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Get all books with pagination and optional filtering by topic ID
   */
  @Get()
  @ApiOperation({ summary: 'Get all books with pagination' })
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
    name: 'filterByTopicName',
    required: false,
    type: String,
    description: 'Filter Books by Topic Name',
  })
  @ApiResponse({
    status: 200,
    description: 'Books retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterByTopicName') filterByTopicName: string,
  ): Promise<GetAllBooks<Book[]>> {
    try {
      // Call the service method to get the paginated books
      const { books, totalEntries } = await this.booksService.findAll(
        page,
        limit,
        filterByTopicName,
      );
      const totalPages = Math.ceil(totalEntries / limit ? limit : 10);
      return {
        status: 'success',
        data: {
          items: books,
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
   * Create a new book
   */
  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createBookDto: CreateBookDto): Promise<GetBook<Book>> {
    try {
      const result = await this.booksService.create(createBookDto);
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
   * Get a specific book by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id') id: string): Promise<GetBook<Book>> {
    try {
      const result = await this.booksService.findOne(id);
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
   * Update a specific book by ID
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a specific book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<GetBook<Book>> {
    try {
      const result = await this.booksService.update(id, updateBookDto);
      if (result) {
        return {
          status: 'success',
          data: result,
        };
      } else {
        return {
          status: 'error',
          message: 'Book not found',
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
   * Delete a specific book by ID
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific book by ID' })
  @ApiResponse({
    status: 200,
    description: 'Book deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id') id: string): Promise<GetBook<Book>> {
    try {
      await this.booksService.remove(id);
      return { status: 'success', message: 'Book deleted successfully' };
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
   * Get books by Topic ID
   */
  @Get('/topic/:topicId')
  @ApiOperation({ summary: 'Get all books for a specific topic by Topic ID' })
  @ApiResponse({
    status: 200,
    description: 'Books retrieved successfully for the given topic ID',
  })
  @ApiResponse({
    status: 404,
    description: 'No books found for the given topic',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByTopicName(
    @Param('topicId') topicId: string,
  ): Promise<GetBook<Book[]>> {
    try {
      const books = await this.booksService.findByTopicName(topicId);
      if (!books || books.length === 0) {
        throw new NotFoundException(`No books found for the topic ${topicId}`);
      }
      return { status: 'success', data: books };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
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
