import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @IsString()
  @IsNotEmpty()
  author!: string;

  @ApiPropertyOptional({
    description: 'The published date of the book',
    example: '1925-04-10',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishedDate?: Date;

  @ApiProperty({
    description: 'The unique ISBN of the book',
    example: '978-0743273565',
  })
  @IsString()
  @IsNotEmpty()
  isbn!: string;

  @ApiPropertyOptional({
    description: 'The topics associated with the book',
    example: ['615c1b5c8f1b2c1c9c6a2b5c', '615c1b5c8f1b2c1c9c6a2b5d'],
  })
  @IsArray()
  @IsOptional()
  topics?: string[];
}

export class UpdateBookDto {
  @ApiPropertyOptional({
    description: 'The title of the book',
    example: 'The Great Gatsby',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    description: 'The published date of the book',
    example: '1925-04-10',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  publishedDate?: Date;

  @ApiPropertyOptional({
    description: 'The unique ISBN of the book',
    example: '978-0743273565',
  })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiPropertyOptional({
    description: 'The topics associated with the book',
    example: ['615c1b5c8f1b2c1c9c6a2b5c', '615c1b5c8f1b2c1c9c6a2b5d'],
  })
  @IsArray()
  @IsOptional()
  topics?: string[];
}
