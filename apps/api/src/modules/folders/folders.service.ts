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
    const folder = await this.foldersRepository.findById(id);
    if (!folder || folder.deleted) {
      throw new NotFoundException(`No folder with id ${id} exists`);
    }

    const originalLocation = await this.retrieveFolderPath(folder.parentId);
    const deletedFolder = await this.foldersRepository.markDeleted(
      id,
      originalLocation,
    );
    if (!deletedFolder) {
      throw new NotFoundException(`No folder with id ${id} exists`);
    }

    return deletedFolder;
  }

  private async retrieveFolderPath(
    folderId: string | null,
  ): Promise<string | null> {
    if (folderId === null) {
      return null;
    }

    const names: string[] = [];
    let currentFolder = await this.foldersRepository.findById(folderId);

    while (currentFolder) {
      names.push(currentFolder.name);
      if (currentFolder.parentId === null) {
        return names.reverse().join('/');
      }
      currentFolder = await this.foldersRepository.findById(
        currentFolder.parentId,
      );
    }

    throw new NotFoundException('Unable to retrieve folder path');
  }
}
