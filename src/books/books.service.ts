import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './books.dto';
import { BooksDAL } from './books.DAL';
import { Book } from './books.schema';

@Injectable()
export class BooksService {
  constructor(private readonly booksDAL: BooksDAL) {}

  // Create a new book
  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      return await this.booksDAL.create(createBookDto);
    } catch (error) {
      throw error;
    }
  }

  // Find all books with pagination and optional filtering by topic name
  async findAll(
    page: number = 1,
    limit: number = 10,
    filterByTopicName: string,
  ): Promise<{ books: Book[]; totalEntries: number }> {
    try {
      const skip = (page - 1) * limit;
      return await this.booksDAL.findAll(limit, skip, filterByTopicName);
    } catch (error) {
      throw error;
    }
  }

  // Find a book by ID
  async findOne(id: string): Promise<Book> {
    try {
      const book = await this.booksDAL.findOne(id);
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return book;
    } catch (error) {
      throw error;
    }
  }

  // Update a book by ID
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    try {
      return await this.booksDAL.update(id, updateBookDto);
    } catch (error) {
      throw error;
    }
  }

  // Remove a book by ID
  async remove(id: string): Promise<String> {
    try {
      const deletedBook = await this.booksDAL.remove(id);
      if (!deletedBook.message) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return deletedBook.message;
    } catch (error) {
      throw error;
    }
  }

  // Find books by topic name
  async findByTopicName(topicId: string): Promise<Book[]> {
    try {
      const books = await this.booksDAL.findByTopic(topicId);
      if (!books.length) {
        throw new NotFoundException(`No books found for the topic ${topicId}`);
      }
      return books;
    } catch (error) {
      throw error;
    }
  }
}
