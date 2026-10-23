import { IsNotEmpty, ValidateIf, IsString, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @IsString({ message: 'Folder name must be string' })
  @IsNotEmpty({ message: 'Folder name cannot be empty' })
  name!: string;

  @ValidateIf((_, value) => value !== null)
  @IsUUID('4', { message: 'parentId must be a valid UUUID or null' })
  parentId!: string | null;
}
