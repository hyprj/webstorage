import { NotFoundException } from '@nestjs/common';
import { File, Folder } from '../../db/schema';
import { FoldersRepository } from '../folders/folders.repository';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

describe('FilesService', () => {
  let filesRepository: {
    findAll: Mock<FilesRepository['findAll']>;
    findById: Mock<FilesRepository['findById']>;
    create: Mock<FilesRepository['create']>;
    markDeleted: Mock<FilesRepository['markDeleted']>;
  };
  let foldersRepository: {
    markDeleted: Mock<FoldersRepository['markDeleted']>;
    findChildren: Mock<FoldersRepository['findChildren']>;
    findById: Mock<FoldersRepository['findById']>;
    create: Mock<FoldersRepository['create']>;
  };
  let service: FilesService;

  beforeEach(() => {
    filesRepository = {
      findAll: vi.fn<FilesRepository['findAll']>(),
      findById: vi.fn<FilesRepository['findById']>(),
      create: vi.fn<FilesRepository['create']>(),
      markDeleted: vi.fn<FilesRepository['markDeleted']>(),
    };
    foldersRepository = {
      markDeleted: vi.fn<FoldersRepository['markDeleted']>(),
      findChildren: vi.fn<FoldersRepository['findChildren']>(),
      findById: vi.fn<FoldersRepository['findById']>(),
      create: vi.fn<FoldersRepository['create']>(),
    };
    service = new FilesService(filesRepository, foldersRepository);
  });

  it('delegates listing to the repository', async () => {
    const files = [{ id: 'file-id' }] as File[];
    filesRepository.findAll.mockResolvedValue(files);

    await expect(service.getFiles('folder-id')).resolves.toBe(files);
    expect(filesRepository.findAll).toHaveBeenCalledWith('folder-id');
  });

  it('does not create a file when its folder does not exist', async () => {
    foldersRepository.findById.mockResolvedValue(undefined);

    await expect(
      service.createFile({
        name: 'file',
        contentType: 'text/plain',
        size: 1,
        folderId: 'missing-folder',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(filesRepository.create).not.toHaveBeenCalled();
  });

  it('creates a file after validating its folder', async () => {
    foldersRepository.findById.mockResolvedValue({ id: 'folder-id' } as Folder);
    const createdFile = { id: 'file-id' } as File;
    filesRepository.create.mockResolvedValue(createdFile);

    await expect(
      service.createFile({
        name: 'file',
        contentType: 'text/plain',
        size: 1,
        folderId: 'folder-id',
      }),
    ).resolves.toBe(createdFile);
    expect(filesRepository.create).toHaveBeenCalledWith({
      name: 'file',
      contentType: 'text/plain',
      size: 1,
      folderId: 'folder-id',
    });
  });

  it('throws when the file to delete does not exist', async () => {
    filesRepository.findById.mockResolvedValue(undefined);

    await expect(service.deleteFile('missing-file')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('soft-deletes a root file without an original location', async () => {
    const file = { id: 'file-id', folderId: null } as File;
    filesRepository.findById.mockResolvedValue(file);
    filesRepository.markDeleted.mockResolvedValue(file);

    await expect(service.deleteFile('file-id')).resolves.toBe(file);
    expect(filesRepository.markDeleted).toHaveBeenCalledWith('file-id', null);
  });

  it('stores the folder path when deleting a nested file', async () => {
    const file = { id: 'file-id', folderId: 'child-id' } as File;
    filesRepository.findById.mockResolvedValue(file);
    foldersRepository.findById
      .mockResolvedValueOnce({
        id: 'child-id',
        name: 'Reports',
        parentId: 'root-id',
      } as Folder)
      .mockResolvedValueOnce({
        id: 'root-id',
        name: 'Projects',
        parentId: null,
      } as Folder);
    filesRepository.markDeleted.mockResolvedValue(file);

    await service.deleteFile('file-id');

    expect(filesRepository.markDeleted).toHaveBeenCalledWith(
      'file-id',
      'Projects/Reports',
    );
  });
});
