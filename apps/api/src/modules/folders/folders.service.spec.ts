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
    markDeleted: Mock<FoldersRepository['markDeleted']>;
  };
  let service: FoldersService;

  beforeEach(() => {
    foldersRepository = {
      findChildren: vi.fn<FoldersRepository['findChildren']>(),
      findById: vi.fn<FoldersRepository['findById']>(),
      create: vi.fn<FoldersRepository['create']>(),
      markDeleted: vi.fn<FoldersRepository['markDeleted']>(),
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
    foldersRepository.findById.mockResolvedValue(undefined);

    await expect(service.deleteFolder('missing-folder')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('soft-deletes a root folder without an original location', async () => {
    const folder = { id: 'folder-id', parentId: null } as Folder;
    foldersRepository.findById.mockResolvedValue(folder);
    foldersRepository.markDeleted.mockResolvedValue(folder);

    await expect(service.deleteFolder('folder-id')).resolves.toBe(folder);
    expect(foldersRepository.markDeleted).toHaveBeenCalledWith(
      'folder-id',
      null,
    );
  });

  it('stores the parent path when deleting a nested folder', async () => {
    const folder = { id: 'child-id', parentId: 'root-id' } as Folder;
    foldersRepository.findById
      .mockResolvedValueOnce(folder)
      .mockResolvedValueOnce({
        id: 'root-id',
        name: 'Projects',
        parentId: null,
      } as Folder);
    foldersRepository.markDeleted.mockResolvedValue(folder);

    await service.deleteFolder('child-id');

    expect(foldersRepository.markDeleted).toHaveBeenCalledWith(
      'child-id',
      'Projects',
    );
  });
});
