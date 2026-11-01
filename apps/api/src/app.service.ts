import { Injectable } from '@nestjs/common';
import { FoldersRepository } from './modules/folders/folders.repository';

@Injectable()
export class AppService {
  constructor(private readonly foldersRepository: FoldersRepository) {}

  async getHello() {
    const allFolders = await this.foldersRepository.findChildren();
    return {
      status: 'ok',
      folders: allFolders,
    };
  }
}
