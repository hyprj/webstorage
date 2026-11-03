import { Injectable, NotImplementedException } from '@nestjs/common';
import { TrashItems, TrashRepository } from './trash.repository';

@Injectable()
export class TrashService {
  constructor(private readonly trashRepository: TrashRepository) {}

  async getTrash(folderId: string | null = null): Promise<TrashItems> {
    return this.trashRepository.findDeleted(folderId);
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.trashRepository.findNonDeletedFile(fileId);

    if (!file) {
      throw new Error('File to restore not found');
    }

    const deletedFile = await this.trashRepository.deleteFile(fileId);

    if (!deletedFile) {
      throw new Error('Unable to delete the file');
    }
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

    const restoredFile = await this.trashRepository.restoreFile(fileId);

    if (!restoredFile) {
      throw new Error('Unable to restore the file');
    }
  }

  async restoreFolder(_folderId: string): Promise<never> {
    // update 'deleted' column
    throw new NotImplementedException();
  }

  async permanentlyDeleteFile(_fileId: string): Promise<never> {
    // this will be implemented as 'purge file' later on
    throw new NotImplementedException();
  }

  async permanentlyDeleteFolder(_folderId: string): Promise<never> {
    // this will be implemented as 'purge folder' later on
    throw new NotImplementedException();
  }
}
