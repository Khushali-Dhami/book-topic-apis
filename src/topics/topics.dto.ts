import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({
    description: 'The name of the Topic',
    example: 'Fiction',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'The description of the Topic',
    example: 'All fictional works.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTopicDto {
  @ApiPropertyOptional({
    description: 'The name of the Topic',
    example: 'Fiction',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'The description of the Topic',
    example: 'All fictional works.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
