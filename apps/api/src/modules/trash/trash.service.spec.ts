import { NotFoundException } from '@nestjs/common';
import { File, Folder } from '../../db/schema';
import { FoldersRepository } from '../folders/folders.repository';
import { TrashRepository } from './trash.repository';
import { TrashService } from './trash.service';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

describe('TrashService', () => {
  let trashRepository: {
    findDeleted: Mock<TrashRepository['findDeleted']>;
    findDeletedFile: Mock<TrashRepository['findDeletedFile']>;
    restoreFile: Mock<TrashRepository['restoreFile']>;
    findDeletedFolder: Mock<TrashRepository['findDeletedFolder']>;
    restoreFolder: Mock<TrashRepository['restoreFolder']>;
  };
  let foldersRepository: {
    findChildren: Mock<FoldersRepository['findChildren']>;
    findById: Mock<FoldersRepository['findById']>;
    create: Mock<FoldersRepository['create']>;
  };
  let service: TrashService;

  beforeEach(() => {
    trashRepository = {
      findDeleted: vi.fn<TrashRepository['findDeleted']>(),
      findDeletedFile: vi.fn<TrashRepository['findDeletedFile']>(),
      restoreFile: vi.fn<TrashRepository['restoreFile']>(),
      findDeletedFolder: vi.fn<TrashRepository['findDeletedFolder']>(),
      restoreFolder: vi.fn<TrashRepository['restoreFolder']>(),
    };
    foldersRepository = {
      findChildren: vi.fn<FoldersRepository['findChildren']>(),
      findById: vi.fn<FoldersRepository['findById']>(),
      create: vi.fn<FoldersRepository['create']>(),
    };
    service = new TrashService(trashRepository, foldersRepository);
  });

  it('delegates trash listing to the repository', async () => {
    const items = { files: [], folders: [] };
    trashRepository.findDeleted.mockResolvedValue(items);

    await expect(service.getTrash()).resolves.toBe(items);
    expect(trashRepository.findDeleted).toHaveBeenCalledWith(null);
  });

  it('restores a root file without creating folders', async () => {
    const file = { id: 'file-id', folderId: null, originalLocation: null } as File;
    trashRepository.findDeletedFile.mockResolvedValue(file);
    trashRepository.restoreFile.mockResolvedValue(file);

    await expect(service.restoreFile('file-id')).resolves.toBeUndefined();
    expect(trashRepository.restoreFile).toHaveBeenCalledWith('file-id', null);
    expect(foldersRepository.create).not.toHaveBeenCalled();
  });

  it('recreates a missing path before restoring a file', async () => {
    const file = {
      id: 'file-id',
      folderId: 'deleted-folder-id',
      originalLocation: 'Projects/Reports',
    } as File;
    trashRepository.findDeletedFile.mockResolvedValue(file);
    foldersRepository.findChildren
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    foldersRepository.create
      .mockResolvedValueOnce({
        id: 'projects-id',
        name: 'Projects',
      } as Folder)
      .mockResolvedValueOnce({
        id: 'reports-id',
        name: 'Reports',
      } as Folder);
    trashRepository.restoreFile.mockResolvedValue(file);

    await service.restoreFile('file-id');

    expect(trashRepository.restoreFile).toHaveBeenCalledWith(
      'file-id',
      'reports-id',
    );
  });

  it('restores a folder under an existing path', async () => {
    const folder = {
      id: 'folder-id',
      originalLocation: 'Projects',
    } as Folder;
    trashRepository.findDeletedFolder.mockResolvedValue(folder);
    foldersRepository.findChildren.mockResolvedValue([
      { id: 'projects-id', name: 'Projects' } as Folder,
    ]);
    trashRepository.restoreFolder.mockResolvedValue(folder);

    await service.restoreFolder('folder-id');

    expect(trashRepository.restoreFolder).toHaveBeenCalledWith(
      'folder-id',
      'projects-id',
    );
  });

  it('throws when the file is not in trash', async () => {
    trashRepository.findDeletedFile.mockResolvedValue(undefined);

    await expect(service.restoreFile('missing-file')).rejects.toThrow(
      NotFoundException,
    );
  });
});
