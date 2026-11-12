import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { FoldersRepository } from '../folders/folders.repository';
import { TrashItems, TrashRepository } from './trash.repository';
import { DefaultRetentionService } from '../dataRetention/defaultRetention/default-retention.service';

@Injectable()
export class TrashService {
  constructor(
    private readonly trashRepository: TrashRepository,
    private readonly foldersRepository: FoldersRepository,
    private readonly defaultRetentionService: DefaultRetentionService,
  ) {}

  async getTrash(folderId: string | null = null): Promise<TrashItems> {
    return this.trashRepository.findDeleted(folderId);
  }

  async markDeleted(_folderId: string): Promise<never> {
    // update 'deleted' column
    throw new NotImplementedException();
  }

  async restoreFile(fileId: string): Promise<void> {
    const file = await this.trashRepository.findDeletedFile(fileId);

    if (!file) {
      throw new NotFoundException(`File ${fileId} not found in trash`);
    }

    const folderId = file.originalLocation
      ? await this.ensureFolderPath(file.originalLocation)
      : file.folderId;

    const restoredFile = await this.trashRepository.restoreFile(
      fileId,
      folderId,
    );

    if (!restoredFile) {
      throw new NotFoundException(`File ${fileId} could not be restored`);
    }
  }

  async restoreFolder(folderId: string): Promise<void> {
    const folder = await this.trashRepository.findDeletedFolder(folderId);

    if (!folder) {
      throw new NotFoundException(`Folder ${folderId} not found in trash`);
    }

    const parentId = folder.originalLocation
      ? await this.ensureFolderPath(folder.originalLocation)
      : null;
    const restoredFolder = await this.trashRepository.restoreFolder(
      folderId,
      parentId,
    );

    if (!restoredFolder) {
      throw new NotFoundException(`Folder ${folderId} could not be restored`);
    }
  }

  async permanentlyDeleteFile(fileId: string): Promise<void> {
    const file = await this.trashRepository.findDeletedFile(fileId);

    if (!file) {
      throw new NotFoundException(`File ${fileId} not found in trash`);
    }

    if (!file.deletedAt) {
      throw new InternalServerErrorException('Trashed file has no deletedAt');
    }

    const canDelete =
      await this.defaultRetentionService.canPermanentlyDeleteEntry(
        file.deletedAt,
      );

    if (canDelete) {
      await this.trashRepository.permanentlyDeleteFile(fileId);
    } else {
      throw new ForbiddenException(
        'This file cannot be permanently deleted until its retention period has elapsed',
      );
    }
  }

  async permanentlyDeleteFolder(folderId: string): Promise<void> {
    const folder = await this.trashRepository.findDeletedFolder(folderId);

    if (!folder) {
      throw new NotFoundException(`Folder ${folderId} not found in trash`);
    }

    if (!folder.deletedAt) {
      throw new InternalServerErrorException('Trashed folder has no deletedAt');
    }

    const canDelete =
      await this.defaultRetentionService.canPermanentlyDeleteEntry(
        folder.deletedAt,
      );

    if (!canDelete) {
      throw new ForbiddenException(
        'This folder cannot be permanently deleted until its retention period has elapsed',
      );
    }

    await this.trashRepository.permanentlyDeleteFolder(folderId);
  }

  private async ensureFolderPath(folderPath: string): Promise<string | null> {
    const folderNames = folderPath
      .split('/')
      .map((name) => name.trim())
      .filter(Boolean);
    let parentId: string | null = null;

    for (const folderName of folderNames) {
      const children = await this.foldersRepository.findChildren(parentId);
      const existingFolder = children.find(
        (folder) => folder.name === folderName,
      );

      if (existingFolder) {
        parentId = existingFolder.id;
        continue;
      }

      const createdFolder = await this.foldersRepository.create({
        name: folderName,
        parentId,
      });

      if (!createdFolder) {
        throw new Error(`Unable to recreate folder "${folderName}"`);
      }

      parentId = createdFolder.id;
    }

    return parentId;
  }
}
