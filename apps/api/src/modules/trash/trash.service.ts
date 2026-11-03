import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { FoldersRepository } from '../folders/folders.repository';
import { TrashItems, TrashRepository } from './trash.repository';

@Injectable()
export class TrashService {
  constructor(
    private readonly trashRepository: TrashRepository,
    private readonly foldersRepository: FoldersRepository,
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
      throw new Error('Deleted file not found');
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

  async restoreFolder(_folderId: string): Promise<void> {}

  async permanentlyDeleteFile(_fileId: string): Promise<never> {
    // TODO: permanently remove the file from storage and the database.
    throw new NotImplementedException();
  }

  async permanentlyDeleteFolder(_folderId: string): Promise<never> {
    // this will be implemented as 'purge folder' later on
    throw new NotImplementedException();
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
