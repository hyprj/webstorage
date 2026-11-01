import { NotFoundException } from '@nestjs/common';
import { File, Folder } from '../../db/schema';
import { FoldersRepository } from '../folders/folders.repository';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

describe('FilesService', () => {
  let filesRepository: {
    findAll: Mock<FilesRepository['findAll']>;
    create: Mock<FilesRepository['create']>;
    markDeleted: Mock<FilesRepository['markDeleted']>;
  };
  let foldersRepository: {
    findChildren: Mock<FoldersRepository['findChildren']>;
    findById: Mock<FoldersRepository['findById']>;
    create: Mock<FoldersRepository['create']>;
    deleteById: Mock<FoldersRepository['deleteById']>;
  };
  let service: FilesService;

  beforeEach(() => {
    filesRepository = {
      findAll: vi.fn<FilesRepository['findAll']>(),
      create: vi.fn<FilesRepository['create']>(),
      markDeleted: vi.fn<FilesRepository['markDeleted']>(),
    };
    foldersRepository = {
      findChildren: vi.fn<FoldersRepository['findChildren']>(),
      findById: vi.fn<FoldersRepository['findById']>(),
      create: vi.fn<FoldersRepository['create']>(),
      deleteById: vi.fn<FoldersRepository['deleteById']>(),
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
    filesRepository.markDeleted.mockResolvedValue(undefined);

    await expect(service.deleteFile('missing-file')).rejects.toThrow(
      NotFoundException,
    );
  });
});
