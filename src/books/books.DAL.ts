import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './books.schema';
import { CreateBookDto, UpdateBookDto } from './books.dto';
import { TopicsService } from 'src/topics/topics.service';

@Injectable()
export class BooksDAL {
  constructor(
    @InjectModel('books') private readonly bookModel: Model<Book>,
    private readonly topicsService: TopicsService,
  ) {}

  /**
   * Check if a given topic ID exists in the database
   */
  async checkTopicExists(topicId: string): Promise<boolean> {
    const topic = await this.topicsService.findOne(topicId);
    return !!topic; // Return true if the topic exists, false otherwise
  }

  // Create a new book with a uniqueness check for ISBN
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const bookWithSameIsbn = await this.bookModel
      .findOne({
        isbn: createBookDto.isbn,
      })
      .exec();
    if (bookWithSameIsbn) {
      throw new ConflictException(
        `Book with ISBN ${createBookDto.isbn} already exists.`,
      );
    }
    const { topics } = createBookDto;

    // Check if all topic IDs are valid
    if (topics?.length) {
      for (const topicId of topics) {
        const isValidTopic = await this.checkTopicExists(topicId);
        if (!isValidTopic) {
          throw new BadRequestException(
            `Topic with ID ${topicId} does not exist`,
          );
        }
      }
    }
    // Proceed with book creation if all topics are valid
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  // Retrieve all books with pagination and populated topics
  async findAll(
    limit: number,
    skip: number,
    filterByTopicName: string,
  ): Promise<{ books: Book[]; totalEntries: number }> {
    try {
      let filter;
      if (filterByTopicName) {
        const topics = await this.topicsService.findByName(filterByTopicName);
        if (!topics.length) {
          return { books: [], totalEntries: 0 };
        }
        filter = topics;
      }
      // Check if the filter is provided and has topic IDs
      const topicFilter =
        filter && filter.length > 0
          ? { topics: { $in: filter.map((topic) => topic._id) } }
          : {};

      // Get books that match the optional topic filter, with pagination
      const books = await this.bookModel
        .find(topicFilter)
        .skip(skip)
        .limit(limit)
        .populate('topics')
        .exec();

      // Get the total count of books with matching topics for pagination
      const totalEntries = await this.bookModel.countDocuments(books);

      return { books, totalEntries };
    } catch (error) {
      throw error;
    }
  }

  // Retrieve a single book by ID with populated topics
  async findOne(id: string): Promise<Book | null> {
    try {
      const book = await this.bookModel.findById(id).populate('topics');
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return book;
    } catch (error) {
      throw error;
    }
  }

  // Update a book by ID with uniqueness check for ISBN
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    try {
      // Check if book with given ID exists
      const existingBook = await this.findOne(id);
      if (!existingBook) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      // Check for unique ISBN if provided
      if (updateBookDto.isbn) {
        const bookWithSameIsbn = await this.bookModel
          .findOne({
            isbn: updateBookDto.isbn,
            _id: { $ne: id },
          })
          .exec();
        if (bookWithSameIsbn) {
          throw new ConflictException(
            `Book with ISBN ${updateBookDto.isbn} already exists.`,
          );
        }
      }
      const { topics } = updateBookDto;
      if (topics?.length) {
        // Check if all topic IDs are valid
        for (const topicId of topics) {
          const isValidTopic = await this.checkTopicExists(topicId);
          if (!isValidTopic) {
            throw new BadRequestException(
              `Topic with ID ${topicId} does not exist`,
            );
          }
        }
      }
      return this.bookModel
        .findByIdAndUpdate(id, updateBookDto, { new: true })
        .populate('topics')
        .exec();
    } catch (error) {
      throw error;
    }
  }

  // Delete a book by ID
  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.bookModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return { message: 'Book deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Retrieve all books associated with a specific topic
  async findByTopic(topicId: string): Promise<Book[]> {
    try {
      const books = await this.bookModel
        .find({ topics: { $in: [topicId] } })
        .populate('topics')
        .exec();
      return books;
    } catch (error) {
      throw error;
    }
  }
}
