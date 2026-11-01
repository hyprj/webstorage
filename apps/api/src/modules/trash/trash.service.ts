import { Injectable, NotImplementedException } from '@nestjs/common';
import { TrashItems, TrashRepository } from './trash.repository';

@Injectable()
export class TrashService {
  constructor(private readonly trashRepository: TrashRepository) {}

  async getTrash(folderId: string | null = null): Promise<TrashItems> {
    return this.trashRepository.findDeleted(folderId);
  }

  async restoreFile(_fileId: string): Promise<never> {
    // update 'deleted' column
    throw new NotImplementedException();
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
