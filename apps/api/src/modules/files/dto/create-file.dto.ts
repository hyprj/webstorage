import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateFileDto {
  @IsString({ message: 'File name must be string' })
  @IsNotEmpty({ message: 'File name cannot be empty' })
  name!: string;

  @IsString({ message: 'File content type must be string' })
  @IsNotEmpty({ message: 'File content type cannot be empty' })
  contentType!: string;

  @Type(() => Number)
  @IsInt({ message: 'File size must be an integer number of bytes' })
  @Min(0, { message: 'File size cannot be negative' })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'File size exceeds the maximum supported size',
  })
  size!: number;

  @IsOptional()
  @IsUUID('4', { message: 'folderId must be a valid UUID or null' })
  folderId?: string | null;
}
