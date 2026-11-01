import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { FoldersRepository } from './folders.repository';

@Injectable()
export class FoldersService {
  constructor(private readonly foldersRepository: FoldersRepository) {}

  async getFolders(parentId?: string | null) {
    return this.foldersRepository.findChildren(parentId);
  }

  async getFolderById(id: string) {
    const folder = await this.foldersRepository.findById(id);
    if (!folder) {
      throw new NotFoundException(`No folder with id ${id} exist`);
    }

    return folder;
  }

  async createFolder(dto: CreateFolderDto) {
    if (dto.parentId) {
      const parent = await this.foldersRepository.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(`${dto.parentId} does not exist`);
      }
    }

    return this.foldersRepository.create({
      name: dto.name,
      parentId: dto.parentId,
    });
  }

  async deleteFolder(id: string) {
    const deletedFolder = await this.foldersRepository.deleteById(id);
    if (!deletedFolder) {
      throw new NotFoundException(`No folder with id ${id} exists`);
    }

    return deletedFolder;
  }
}
