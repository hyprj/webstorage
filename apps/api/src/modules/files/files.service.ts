import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesRepository } from './files.repository';
import { FoldersRepository } from '../folders/folders.repository';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly foldersRepository: FoldersRepository,
  ) {}

  async getFiles(folderId?: string) {
    return this.filesRepository.findAll(folderId);
  }

  async createFile(fileDto: CreateFileDto) {
    const folderId = fileDto.folderId ?? null;

    if (folderId) {
      const folder = await this.foldersRepository.findById(folderId);
      if (!folder) {
        throw new NotFoundException(`Folder ${folderId} does not exist`);
      }
    }

    return this.filesRepository.create({
      name: fileDto.name,
      contentType: fileDto.contentType,
      size: fileDto.size,
      folderId,
    });
  }

  async deleteFile(fileId: string) {
    const deletedFile = await this.filesRepository.markDeleted(fileId);
    if (!deletedFile) {
      throw new NotFoundException(`File ${fileId} does not exist`);
    }

    return deletedFile;
  }
}
