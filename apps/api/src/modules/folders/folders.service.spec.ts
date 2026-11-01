import { NotFoundException } from '@nestjs/common';
import { Folder } from '../../db/schema';
import { FoldersRepository } from './folders.repository';
import { FoldersService } from './folders.service';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

describe('FoldersService', () => {
  let foldersRepository: {
    findChildren: Mock<FoldersRepository['findChildren']>;
    findById: Mock<FoldersRepository['findById']>;
    create: Mock<FoldersRepository['create']>;
    deleteById: Mock<FoldersRepository['deleteById']>;
  };
  let service: FoldersService;

  beforeEach(() => {
    foldersRepository = {
      findChildren: vi.fn<FoldersRepository['findChildren']>(),
      findById: vi.fn<FoldersRepository['findById']>(),
      create: vi.fn<FoldersRepository['create']>(),
      deleteById: vi.fn<FoldersRepository['deleteById']>(),
    };
    service = new FoldersService(foldersRepository);
  });

  it('delegates child listing to the repository', async () => {
    const folders = [{ id: 'folder-id' }] as Folder[];
    foldersRepository.findChildren.mockResolvedValue(folders);

    await expect(service.getFolders(null)).resolves.toBe(folders);
    expect(foldersRepository.findChildren).toHaveBeenCalledWith(null);
  });

  it('returns a folder found by id', async () => {
    const folder = { id: 'folder-id' } as Folder;
    foldersRepository.findById.mockResolvedValue(folder);

    await expect(service.getFolderById('folder-id')).resolves.toBe(folder);
  });

  it('throws when a parent folder does not exist', async () => {
    foldersRepository.findById.mockResolvedValue(undefined);

    await expect(
      service.createFolder({ name: 'child', parentId: 'missing-parent' }),
    ).rejects.toThrow(NotFoundException);
    expect(foldersRepository.create).not.toHaveBeenCalled();
  });

  it('throws when the folder to delete does not exist', async () => {
    foldersRepository.deleteById.mockResolvedValue(undefined);

    await expect(service.deleteFolder('missing-folder')).rejects.toThrow(
      NotFoundException,
    );
  });
});
